"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion } from "framer-motion";
import type { QueryResult } from "@/lib/sqlEngine";
import type { CaseObjective } from "@/data/cases";

export type LineType = "input" | "output" | "error" | "success" | "system" | "info";

export interface TerminalLine {
  type: LineType;
  content: string;
}

interface SqlTerminalProps {
  dbName: string;
  isReady: boolean;
  isLoading: boolean;
  isCompleted: boolean;
  onRunQuery: (sql: string) => QueryResult | null;
  onGetTableNames: () => string[];
  onDescribeTable: (table: string) => QueryResult | null;
  currentObjective: CaseObjective | undefined;
  onObjectiveValidated: (rows: Record<string, string | number | null>[]) => void;
}

export interface SqlTerminalRef {
  addLines: (lines: TerminalLine[]) => void;
  printSystem: (text: string) => void;
}

// ── MySQL-style table formatter — wraps wide tables at 100 chars ─────────────
const MAX_COL_WIDTH = 48; // truncate very wide values to keep table readable

function formatMysqlTable(result: QueryResult): string[] {
  const { columns, rows, rowCount, execTime } = result;

  if (rowCount === 0) {
    return ["Empty set (" + execTime.toFixed(2) + " sec)"];
  }

  // Calculate column widths, capped at MAX_COL_WIDTH
  const colWidths = columns.map((col) =>
    Math.min(
      MAX_COL_WIDTH,
      Math.max(col.length, ...rows.map((r) => String(r[col] ?? "NULL").length))
    )
  );

  const trunc = (val: string, w: number) =>
    val.length > w ? val.slice(0, w - 1) + "…" : val;

  const sep = "+" + colWidths.map((w) => "-".repeat(w + 2)).join("+") + "+";
  const header =
    "| " +
    columns.map((c, i) => trunc(c, colWidths[i]).padEnd(colWidths[i])).join(" | ") +
    " |";
  const dataLines = rows.map(
    (row) =>
      "| " +
      columns
        .map((c, i) => trunc(String(row[c] ?? "NULL"), colWidths[i]).padEnd(colWidths[i]))
        .join(" | ") +
      " |"
  );

  return [
    sep,
    header,
    sep,
    ...dataLines,
    sep,
    `${rowCount} row${rowCount !== 1 ? "s" : ""} in set (${execTime.toFixed(2)} sec)`,
  ];
}

// ── Syntax highlight tokens ──────────────────────────────────────────────────
const SQL_KEYWORDS = new Set([
  "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "IN", "LIKE", "JOIN", "LEFT", "RIGHT",
  "INNER", "OUTER", "ON", "GROUP", "BY", "ORDER", "HAVING", "LIMIT", "OFFSET",
  "AS", "DISTINCT", "COUNT", "SUM", "AVG", "MAX", "MIN", "INSERT", "UPDATE", "DELETE",
  "CREATE", "DROP", "ALTER", "TABLE", "VIEW", "INDEX", "INTO", "VALUES", "SET",
  "SHOW", "DESCRIBE", "USE", "PRAGMA", "IS", "NULL", "BETWEEN", "EXISTS", "CASE",
  "WHEN", "THEN", "ELSE", "END", "UNION", "ALL", "INTERSECT", "EXCEPT", "WITH",
  "ROLLUP", "CUBE", "GROUPING", "SUBMIT",
]);

function highlightSql(input: string): React.ReactNode[] {
  const tokens = input.split(/(\s+|[(),;*=<>!]+|'[^']*'|"[^"]*"|`[^`]*`)/);
  return tokens.map((token, i) => {
    const upper = token.trim().toUpperCase();
    if (SQL_KEYWORDS.has(upper)) {
      return <span key={i} className="text-[hsl(38,90%,62%)]">{token}</span>;
    }
    if (/^'[^']*'$/.test(token) || /^"[^"]*"$/.test(token)) {
      return <span key={i} className="text-[hsl(140,60%,55%)]">{token}</span>;
    }
    if (/^\d+(\.\d+)?$/.test(token.trim())) {
      return <span key={i} className="text-[hsl(200,80%,65%)]">{token}</span>;
    }
    return <span key={i}>{token}</span>;
  });
}

// ── Parse submit() argument — table name or full SELECT query ─────────────────
function parseSubmitArg(raw: string): { kind: "table"; name: string } | { kind: "query"; sql: string } | null {
  const trimmed = raw.trim();
  // submit(tableName) — simple identifier
  if (/^\w+$/.test(trimmed)) {
    return { kind: "table", name: trimmed };
  }
  // submit(SELECT ...) — SQL query inside
  if (/^select\s+/i.test(trimmed)) {
    return { kind: "query", sql: trimmed };
  }
  return null;
}

// ── Component ─────────────────────────────────────────────────────────────────
export const SqlTerminal = forwardRef<SqlTerminalRef, SqlTerminalProps>(
  function SqlTerminal(
    {
      dbName,
      isReady,
      isLoading,
      isCompleted,
      onRunQuery,
      onGetTableNames,
      onDescribeTable,
      currentObjective,
      onObjectiveValidated,
    },
    ref
  ) {
    const [lines, setLines] = useState<TerminalLine[]>([]);
    const [input, setInput] = useState("");
    const [multilineBuffer, setMultilineBuffer] = useState("");
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIdx, setHistoryIdx] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const terminalEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const addLines = useCallback((newLines: TerminalLine[]) => {
      setLines((prev) => [...prev, ...newLines]);
    }, []);

    const printSystem = useCallback(
      (text: string) => {
        addLines([{ type: "system", content: text }]);
      },
      [addLines]
    );

    useImperativeHandle(ref, () => ({ addLines, printSystem }), [addLines, printSystem]);

    // Scroll to bottom
    useEffect(() => {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [lines]);

    // Print boot message when engine is ready
    useEffect(() => {
      if (!isReady) return;
      setLines([
        { type: "system", content: "╔══════════════════════════════════════════════════════════╗" },
        { type: "system", content: "║   SQL NOIR Evidence Terminal  ·  Powered by SQLite 3     ║" },
        { type: "system", content: "╚══════════════════════════════════════════════════════════╝" },
        { type: "output", content: `Welcome to the SQL NOIR Monitor.  Commands end with ;` },
        { type: "output", content: `Database: ${dbName}` },
        { type: "output", content: `Type 'help;' for help.  Type 'show tables;' to list tables.` },
        { type: "output", content: `` },
        { type: "info", content: `Database changed to \`${dbName}\`` },
        { type: "output", content: `` },
        { type: "system", content: `  HOW TO SUBMIT AN ANSWER:` },
        { type: "output", content: `  submit(table_name)             — submit all rows from a table` },
        { type: "output", content: `  submit(SELECT ... FROM ...)    — submit the result of a query` },
        { type: "output", content: `` },
      ]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }, [isReady, dbName]);

    const prompt = isReady ? `sql-noir [${dbName}]>` : "sql-noir [(loading)]>";

    const getTableNames = useCallback(() => onGetTableNames(), [onGetTableNames]);

    const executeCommand = useCallback(
      (fullCmd: string) => {
        const cmd = fullCmd.trim();
        if (!cmd) return;

        // Echo the command — split into wrapped lines of max 90 chars so it doesn't expand the terminal
        const promptPrefix = multilineBuffer ? "    -> " : `${prompt} `;
        addLines([{ type: "input", content: `${promptPrefix}${cmd}` }]);

        // ── help ──────────────────────────────────────────────────────────
        if (/^help\s*;?\s*$/i.test(cmd) || /^\\h\s*$/i.test(cmd)) {
          addLines([
            { type: "output", content: "" },
            { type: "system", content: "Available commands:" },
            { type: "output", content: "  SELECT ...                  Run any SQL query" },
            { type: "output", content: "  submit(table_name)          Submit table as answer" },
            { type: "output", content: "  submit(SELECT ... FROM ...) Submit query result as answer" },
            { type: "output", content: "  show tables;                List all evidence tables" },
            { type: "output", content: "  describe <table>;           Show table schema" },
            { type: "output", content: "  \\c  or  clear;              Clear the terminal" },
            { type: "output", content: "  help;                       Show this help" },
            { type: "output", content: "" },
          ]);
          return;
        }

        // ── clear ─────────────────────────────────────────────────────────
        if (/^\\c\s*$/i.test(cmd) || /^clear\s*;?\s*$/i.test(cmd)) {
          setLines([]);
          return;
        }

        // ── show tables ───────────────────────────────────────────────────
        if (/^show\s+tables\s*;?\s*$/i.test(cmd)) {
          const names = getTableNames();
          addLines([
            { type: "output", content: "" },
            { type: "system", content: `Tables in \`${dbName}\`:` },
            ...names.map((n) => ({ type: "output" as LineType, content: `  ${n}` })),
            { type: "output", content: `${names.length} row${names.length !== 1 ? "s" : ""} in set (0.00 sec)` },
            { type: "output", content: "" },
          ]);
          return;
        }

        // ── describe ──────────────────────────────────────────────────────
        const describeMatch = cmd.match(/^(?:describe|desc)\s+(\w+)\s*;?\s*$/i);
        if (describeMatch) {
          const tableName = describeMatch[1];
          const result = onDescribeTable(tableName);
          if (!result || result.error) {
            addLines([
              { type: "error", content: `ERROR 1146 (42S02): Table '${dbName}.${tableName}' doesn't exist` },
              { type: "output", content: "" },
            ]);
          } else {
            const formatted = formatMysqlTable(result);
            addLines([
              { type: "output", content: "" },
              ...formatted.map((l) => ({ type: "output" as LineType, content: l })),
              { type: "output", content: "" },
            ]);
          }
          return;
        }

        // ── submit(table | SELECT ...) ────────────────────────────────────
        // Matches: submit(anything here) — the content inside parens may span multiple words
        const submitMatch = cmd.match(/^submit\s*\(\s*([\s\S]+?)\s*\)\s*;?\s*$/i);
        if (submitMatch) {
          const inner = submitMatch[1].trim();
          const parsed = parseSubmitArg(inner);

          if (!parsed) {
            addLines([
              { type: "error", content: `ERROR: submit() argument must be a table name or a SELECT query.` },
              { type: "error", content: `  Examples: submit(suspects)` },
              { type: "error", content: `            submit(SELECT name FROM suspects WHERE ...)` },
              { type: "output", content: "" },
            ]);
            return;
          }

          const sqlToRun =
            parsed.kind === "table"
              ? `SELECT * FROM ${parsed.name}`
              : parsed.sql;

          const label =
            parsed.kind === "table"
              ? `\`${parsed.name}\``
              : `query result`;

          addLines([
            { type: "output", content: "" },
            { type: "system", content: `⏎  Submitting ${label} as answer to current objective...` },
          ]);

          setIsRunning(true);
          setTimeout(() => {
            const result = onRunQuery(sqlToRun);

            if (!result) {
              addLines([
                { type: "error", content: `ERROR: SQL engine not ready.` },
                { type: "output", content: "" },
              ]);
              setIsRunning(false);
              return;
            }

            if (result.error) {
              const errMsg = result.error.replace(/SQLITE_ERROR:\s*/g, "").replace(/parse error/i, "syntax error");
              addLines([
                { type: "error", content: `ERROR 1064 (42000): ${errMsg}` },
                { type: "output", content: "" },
              ]);
              setIsRunning(false);
              return;
            }

            // Display the submitted result
            const formatted = formatMysqlTable(result);
            addLines(formatted.map((l) => ({ type: "output" as LineType, content: l })));

            // Validate against current objective
            if (!currentObjective) {
              addLines([
                { type: "info", content: `ℹ  No active objective — case may already be complete.` },
                { type: "output", content: "" },
              ]);
              setIsRunning(false);
              return;
            }

            const correct = currentObjective.validationFn(result.rows);
            if (correct) {
              addLines([
                { type: "output", content: "" },
                { type: "success", content: `✓  CORRECT — ${currentObjective.successMessage}` },
                { type: "output", content: "" },
              ]);
              onObjectiveValidated(result.rows);
            } else {
              addLines([
                { type: "output", content: "" },
                { type: "error", content: `✗  INCORRECT — Your answer doesn't satisfy the objective.` },
                { type: "error", content: `   Read the objective carefully and refine your query.` },
                { type: "output", content: "" },
              ]);
            }

            setIsRunning(false);
          }, 400);
          return;
        }

        // ── Regular SQL (SELECT, WITH, PRAGMA) — exploration only ─────────
        const isSelect = /^\s*select\s/i.test(cmd);
        const isAllowed =
          isSelect ||
          /^\s*(with\s|pragma\s)/i.test(cmd);

        if (!isAllowed) {
          addLines([
            {
              type: "error",
              content: `ERROR 1142 (42000): Only SELECT queries are allowed in the evidence terminal.`,
            },
            { type: "output", content: "" },
          ]);
          return;
        }

        setIsRunning(true);
        setTimeout(() => {
          const result = onRunQuery(cmd);
          if (!result) {
            addLines([{ type: "error", content: "ERROR: SQL engine not ready." }, { type: "output", content: "" }]);
          } else if (result.error) {
            const errMsg = result.error.replace(/SQLITE_ERROR:\s*/g, "").replace(/parse error/i, "syntax error");
            addLines([
              { type: "error", content: `ERROR 1064 (42000): ${errMsg}` },
              { type: "output", content: "" },
            ]);
          } else {
            const formatted = formatMysqlTable(result);
            addLines([
              { type: "output", content: "" },
              ...formatted.map((l) => ({ type: "output" as LineType, content: l })),
              { type: "output", content: "" },
            ]);
            // NOTE: Regular SELECT queries do NOT auto-validate.
            // Player must explicitly use submit() to submit an answer.
          }
          setIsRunning(false);
        }, 60);
      },
      [
        prompt,
        dbName,
        multilineBuffer,
        addLines,
        getTableNames,
        onRunQuery,
        onDescribeTable,
        currentObjective,
        onObjectiveValidated,
      ]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          if (isRunning || isCompleted || !isReady) return;
          const combined = (multilineBuffer + input).trim();
          if (!combined) return;

          // Multi-line buffering: wait for ; unless it's a meta-command
          const isMetaCmd = /^(submit|help|clear|show\s+tables|\\c|\\h)/i.test(combined);
          if (!combined.endsWith(";") && !isMetaCmd) {
            setMultilineBuffer((prev) => prev + input + " ");
            setInput("");
            addLines([{ type: "input", content: `    -> ${input}` }]);
            return;
          }

          // Strip trailing semicolons (except from submit's inner query)
          let cmd = combined;
          if (!combined.match(/^submit\s*\(/i)) {
            cmd = combined.replace(/;+$/, "");
          }

          setCommandHistory((prev) => [cmd, ...prev.slice(0, 99)]);
          setHistoryIdx(-1);
          setMultilineBuffer("");
          executeCommand(cmd);
          setInput("");
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const next = historyIdx + 1;
          if (next < commandHistory.length) {
            setHistoryIdx(next);
            setInput(commandHistory[next]);
          }
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          const next = historyIdx - 1;
          if (next < 0) {
            setHistoryIdx(-1);
            setInput("");
          } else {
            setHistoryIdx(next);
            setInput(commandHistory[next]);
          }
        } else if (e.key === "Tab") {
          e.preventDefault();
          const word = input.split(/\s+/).pop() ?? "";
          if (word.length >= 2) {
            const tables = getTableNames();
            const match = tables.find((t) => t.startsWith(word.toLowerCase()));
            if (match) {
              setInput((prev) => prev.slice(0, prev.length - word.length) + match);
            }
          }
        }
      },
      [
        isRunning,
        isCompleted,
        isReady,
        input,
        multilineBuffer,
        commandHistory,
        historyIdx,
        executeCommand,
        addLines,
        getTableNames,
      ]
    );

    const lineColor = (type: LineType) => {
      switch (type) {
        case "input": return "text-[hsl(140,60%,55%)]";
        case "error": return "text-[hsl(0,70%,60%)]";
        case "success": return "text-[hsl(140,60%,55%)] font-semibold";
        case "system": return "text-[hsl(38,80%,60%)]";
        case "info": return "text-[hsl(200,70%,65%)]";
        default: return "text-[hsl(220,15%,80%)]";
      }
    };

    return (
      <div
        className="flex flex-col h-full bg-[hsl(220,25%,5%)] overflow-hidden"
        style={{ maxWidth: "100%" }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Loading state */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="font-mono text-xs text-primary tracking-widest"
            >
              ▌ Initializing evidence database...
            </motion.div>
            <div className="font-mono text-[10px] text-muted-foreground/40 tracking-widest">
              Loading sql.js engine · seeding case data
            </div>
          </div>
        )}

        {/* Terminal output */}
        {!isLoading && (
          <div
            className="flex-1 overflow-y-auto overflow-x-hidden px-5 py-4 font-mono text-[12px] leading-[1.75] cursor-text"
            style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
          >
            {lines.map((line, i) => (
              <div
                key={i}
                className={`${lineColor(line.type)}`}
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "anywhere" }}
              >
                {line.content || "\u00A0"}
              </div>
            ))}

            {isRunning && (
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="text-primary text-xs"
              >
                ▌
              </motion.div>
            )}

            {/* Input line */}
            {!isCompleted && isReady && (
              <div
                className="flex mt-0.5 gap-1"
                style={{ flexWrap: "nowrap", minWidth: 0 }}
              >
                <span
                  className="text-[hsl(140,60%,55%)] select-none shrink-0"
                  style={{ whiteSpace: "pre" }}
                >
                  {multilineBuffer ? "    -> " : `${prompt} `}
                </span>
                {/* The input wrapper — MUST be min-w-0 and overflow-hidden so it never expands */}
                <div className="relative flex-1 min-w-0 overflow-hidden">
                  {/* Syntax-highlighted ghost — wraps just like the real input */}
                  <div
                    className="font-mono text-[12px] pointer-events-none"
                    style={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                      minHeight: "1.2em",
                    }}
                    aria-hidden
                  >
                    {highlightSql(input)}
                    {/* invisible caret placeholder so the ghost div matches the real input height */}
                    <span style={{ opacity: 0 }}>|</span>
                  </div>
                  {/* The real (transparent) input field — absolutely positioned over the ghost */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => { setInput(e.target.value); setHistoryIdx(-1); }}
                    onKeyDown={handleKeyDown}
                    disabled={isRunning || !isReady}
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    className="absolute inset-0 w-full h-full bg-transparent border-none outline-none font-mono text-[12px] text-transparent"
                    style={{ caretColor: "hsl(140,60%,55%)", padding: 0 }}
                  />
                </div>
              </div>
            )}

            {isCompleted && (
              <div className="mt-2 font-mono text-[11px] text-muted-foreground/30 italic">
                — Case closed. Evidence terminal sealed. —
              </div>
            )}

            <div ref={terminalEndRef} />
          </div>
        )}
      </div>
    );
  }
);
