"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Lock, Lightbulb, ChevronRight, TerminalSquare, Database, Key, Link2 } from "lucide-react";
import { CASES, type CaseObjective, type CaseSchema } from "@/data/cases";
import { useGameProgress } from "@/hooks/useGameProgress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

type LineType = "input" | "output" | "error" | "success" | "system";

interface TerminalLine {
  type: LineType;
  content: string;
}

export default function CasePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const gameCase = CASES.find((c) => c.slug === slug);
  const { getCurrentObjective, advanceObjective, isCaseUnlocked, isCaseCompleted } = useGameProgress();
  const { toast } = useToast();

  const [mounted, setMounted] = useState(false);
  const [rightView, setRightView] = useState<"terminal" | "schema">("terminal");
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "system", content: "╔══════════════════════════════════════════════════════════════╗" },
    { type: "system", content: "║  SQL NOIR — DETECTIVE TERMINAL                          ║" },
    { type: "system", content: "╚══════════════════════════════════════════════════════════════╝" },
    { type: "output", content: "" },
    { type: "output", content: "Welcome, Detective. This is your investigation terminal." },
    { type: "output", content: "" },
    { type: "output", content: "Commands:" },
    { type: "output", content: "  SELECT ...          Run SQL queries against the evidence database" },
    { type: "output", content: "  submit(name)        Submit your answer to the current objective" },
    { type: "output", content: "  schema              View database tables and columns" },
    { type: "output", content: "  clear               Clear terminal" },
    { type: "output", content: "  help                Show available commands" },
    { type: "output", content: "" },
    { type: "system", content: "─".repeat(62) },
    { type: "output", content: "" },
  ]);
  const [showHint, setShowHint] = useState<string | null>(null);
  const [narratives, setNarratives] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!gameCase || !isCaseUnlocked(gameCase.id)) {
      router.replace("/cases");
    }
  }, [mounted, gameCase, isCaseUnlocked, router]);

  const currentObjIdx = gameCase ? getCurrentObjective(gameCase.id) : 0;
  const completed = gameCase ? isCaseCompleted(gameCase.id) : false;
  const currentObjective: CaseObjective | undefined = gameCase?.objectives[currentObjIdx];

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  // Re-focus input and scroll to bottom when switching back to terminal
  useEffect(() => {
    if (rightView === "terminal") {
      setTimeout(() => {
        inputRef.current?.focus();
        terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [rightView]);

  const addLines = useCallback((newLines: TerminalLine[]) => {
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  const formatTable = (rows: Record<string, unknown>[]): string[] => {
    if (rows.length === 0) return ["(0 rows)"];
    const keys = Object.keys(rows[0]);
    const colWidths = keys.map((k) =>
      Math.max(k.length, ...rows.map((r) => String(r[k] ?? "NULL").length))
    );
    const sep = "+-" + colWidths.map((w) => "-".repeat(w)).join("-+-") + "-+";
    const header = "| " + keys.map((k, i) => k.padEnd(colWidths[i])).join(" | ") + " |";
    const dataLines = rows.map(
      (row) => "| " + keys.map((k, i) => String(row[k] ?? "NULL").padEnd(colWidths[i])).join(" | ") + " |"
    );
    return [sep, header, sep, ...dataLines, sep, `(${rows.length} row${rows.length !== 1 ? "s" : ""})`];
  };

  const handleCommand = useCallback((cmd: string) => {
    if (!gameCase || !currentObjective) return;
    const trimmed = cmd.trim();
    if (!trimmed) return;

    addLines([{ type: "input", content: `sql> ${trimmed}` }]);

    // Handle special commands
    if (trimmed.toLowerCase() === "help") {
      addLines([
        { type: "output", content: "" },
        { type: "system", content: "Available commands:" },
        { type: "output", content: "  SELECT ...          Run a SQL query against the evidence database" },
        { type: "output", content: "  submit(name)        Submit your answer to the current objective" },
        { type: "output", content: "  schema              View database tables and columns" },
        { type: "output", content: "  clear               Clear terminal" },
        { type: "output", content: "  help                Show this help" },
        { type: "output", content: "" },
      ]);
      return;
    }

    if (trimmed.toLowerCase() === "schema") {
      const schemaLines: TerminalLine[] = [
        { type: "output", content: "" },
        { type: "system", content: "╔══ EVIDENCE DATABASE SCHEMA ══╗" },
        { type: "output", content: "" },
      ];
      gameCase.schema.tables.forEach((table) => {
        schemaLines.push({ type: "system", content: `┌─ ${table.name} ${"─".repeat(Math.max(0, 40 - table.name.length))}┐` });
        table.columns.forEach((col) => {
          const keyTag = col.key ? ` [${col.key}]` : "";
          schemaLines.push({ type: "output", content: `│  ${col.name.padEnd(20)} ${col.type.padEnd(12)}${keyTag}` });
        });
        if (table.references && table.references.length > 0) {
          schemaLines.push({ type: "output", content: "│" });
          table.references.forEach((ref) => {
            schemaLines.push({ type: "output", content: `│  FK: ${ref.column} → ${ref.refTable}.${ref.refColumn}` });
          });
        }
        schemaLines.push({ type: "system", content: `└${"─".repeat(44)}┘` });
        schemaLines.push({ type: "output", content: "" });
      });
      addLines(schemaLines);
      return;
    }

    if (trimmed.toLowerCase() === "clear") {
      setLines([]);
      return;
    }

    // Handle submit(name)
    const submitMatch = trimmed.match(/^submit\((.+)\)$/i);
    if (submitMatch) {
      const answer = submitMatch[1].trim().replace(/['"]/g, "");
      addLines([
        { type: "output", content: "" },
        { type: "system", content: `Submitting answer: "${answer}"...` },
      ]);

      if (currentObjective.validationFn([{ answer }])) {
        addLines([
          { type: "success", content: `✓ ${currentObjective.successMessage}` },
          { type: "output", content: "" },
        ]);
        toast({ title: "🔍 " + currentObjective.successMessage, description: "Objective complete." });
        setNarratives((prev) => [...prev, currentObjective.narrativeAfter]);
        advanceObjective(gameCase.id, gameCase.objectives.length);
      } else {
        addLines([
          { type: "error", content: "✗ That doesn't seem right, Detective. Keep investigating." },
          { type: "output", content: "" },
        ]);
      }
      return;
    }

    // SQL query
    if (!trimmed.toLowerCase().startsWith("select")) {
      addLines([
        { type: "error", content: "Only SELECT queries are allowed. We read evidence, not tamper with it." },
        { type: "output", content: "" },
      ]);
      return;
    }

    setIsRunning(true);
    setTimeout(() => {
      const mockResults = generateMockResults(gameCase.id, currentObjIdx, trimmed);
      if (mockResults.error) {
        addLines([
          { type: "error", content: mockResults.error },
          { type: "output", content: "" },
        ]);
      } else {
        const tableLines = formatTable(mockResults.rows);
        addLines([
          { type: "output", content: "" },
          ...tableLines.map((l) => ({ type: "output" as LineType, content: l })),
          { type: "output", content: "" },
        ]);
      }
      setIsRunning(false);
    }, 600);
  }, [gameCase, currentObjective, currentObjIdx, addLines, advanceObjective, toast]);

  // Show nothing until mounted (avoids SSR hydration mismatch)
  if (!mounted) return null;
  if (!gameCase || !isCaseUnlocked(gameCase.id)) return null;

  const lineColor = (type: LineType) => {
    switch (type) {
      case "input": return "text-noir-green";
      case "error": return "text-destructive";
      case "success": return "text-noir-green font-bold";
      case "system": return "text-primary";
      default: return "text-foreground/70";
    }
  };

  return (
    <div className="h-screen flex flex-col noir-gradient">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <Link href="/cases" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="font-typewriter text-primary text-lg tracking-wider">{gameCase.title}</h1>
        <Badge className="font-typewriter text-[10px] border border-primary/30 bg-primary/10 text-primary ml-auto">
          {gameCase.subtitle}
        </Badge>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Case Guide */}
        <div className="w-80 lg:w-96 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="font-typewriter text-sm text-primary tracking-widest uppercase">Case Briefing</h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              <div className="case-file rounded p-4 text-sm">
                <p className="font-mono-case text-noir-ink/80 leading-relaxed text-xs">{gameCase.briefing}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-typewriter text-xs text-muted-foreground tracking-widest uppercase">Objectives</h3>
                {gameCase.objectives.map((obj, i) => {
                  const isActive = i === currentObjIdx && !completed;
                  const isDone = i < currentObjIdx || completed;

                  return (
                    <div
                      key={obj.id}
                      className={`p-3 rounded border ${
                        isActive ? "border-primary/40 bg-primary/5"
                          : isDone ? "border-noir-green/20 bg-noir-green/5"
                          : "border-border bg-secondary/30 opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isDone ? <CheckCircle className="w-4 h-4 text-noir-green shrink-0" />
                          : isActive ? <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                          : <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                        <span className={`font-typewriter text-xs ${isActive ? "text-primary" : isDone ? "text-noir-green" : "text-muted-foreground"}`}>
                          {obj.title}
                        </span>
                      </div>
                      {(isActive || isDone) && (
                        <p className="text-xs text-muted-foreground mt-1.5 ml-6 leading-relaxed">{obj.description}</p>
                      )}
                      {isActive && (
                        <button
                          onClick={() => setShowHint(showHint === obj.id ? null : obj.id)}
                          className="flex items-center gap-1 mt-2 ml-6 text-[10px] text-primary/60 hover:text-primary transition-colors font-mono-case"
                        >
                          <Lightbulb className="w-3 h-3" /> {showHint === obj.id ? "Hide Hint" : "Need a hint?"}
                        </button>
                      )}
                      {showHint === obj.id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                          className="ml-6 mt-2 p-2 rounded bg-primary/10 border border-primary/20">
                          <code className="text-[10px] text-primary/80 font-mono">{obj.hint}</code>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

              {narratives.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-typewriter text-xs text-muted-foreground tracking-widest uppercase">Case Notes</h3>
                  {narratives.map((n, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="case-file rounded p-3">
                      <p className="font-mono-case text-noir-ink/80 text-xs italic leading-relaxed">{n}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {completed && (
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
                  <div className="stamp-effect inline-block font-typewriter text-lg animate-stamp-slam">Case Closed</div>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* RIGHT: Terminal / Schema panel */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Tab bar */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-[hsl(220,20%,6%)] shrink-0">
            <button
              onClick={() => setRightView("terminal")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-typewriter tracking-wider transition-all ${
                rightView === "terminal"
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
              }`}
            >
              <TerminalSquare className="w-3 h-3" />
              Terminal
            </button>
            <button
              onClick={() => setRightView("schema")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-typewriter tracking-wider transition-all ${
                rightView === "schema"
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
              }`}
            >
              <Database className="w-3 h-3" />
              Schema
            </button>
            <div className="ml-auto flex items-center gap-2 pr-1">
              {isRunning && (
                <span className="text-[10px] font-mono text-primary/60 animate-pulse tracking-widest">executing…</span>
              )}
              <div className={`w-2 h-2 rounded-full transition-colors ${completed ? "bg-noir-green shadow-[0_0_6px_hsl(var(--noir-green)/0.6)]" : "bg-primary/40"}`} title={completed ? "Case closed" : "Active"} />
            </div>
          </div>

          {/* Terminal view — never unmounted so state persists */}
          <div
            className={`flex-1 flex flex-col bg-[hsl(220,20%,6%)] overflow-hidden ${rightView !== "terminal" ? "hidden" : ""}`}
            onClick={() => inputRef.current?.focus()}
          >
            <div
              ref={terminalContainerRef}
              className="flex-1 overflow-y-auto px-5 py-4 font-mono text-xs leading-[1.7] cursor-text"
            >
              {lines.map((line, i) => (
                <div key={i} className={`${lineColor(line.type)} whitespace-pre`}>
                  {line.content || "\u00A0"}
                </div>
              ))}

              {isRunning && (
                <div className="flex items-center gap-1 text-primary/50">
                  <span className="animate-pulse">▌</span>
                </div>
              )}

              {/* Inline input — the actual CLI prompt */}
              <div className="flex items-center gap-0 mt-0.5">
                <span className="text-noir-green terminal-glow font-mono text-xs select-none whitespace-pre shrink-0">
                  sql&gt;&nbsp;
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setHistoryIndex(-1);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isRunning && !completed) {
                      if (input.trim()) {
                        setCommandHistory((prev) => [input.trim(), ...prev.slice(0, 49)]);
                        setHistoryIndex(-1);
                      }
                      handleCommand(input);
                      setInput("");
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      const nextIdx = historyIndex + 1;
                      if (nextIdx < commandHistory.length) {
                        setHistoryIndex(nextIdx);
                        setInput(commandHistory[nextIdx]);
                      }
                    } else if (e.key === "ArrowDown") {
                      e.preventDefault();
                      const nextIdx = historyIndex - 1;
                      if (nextIdx < 0) {
                        setHistoryIndex(-1);
                        setInput("");
                      } else {
                        setHistoryIndex(nextIdx);
                        setInput(commandHistory[nextIdx]);
                      }
                    }
                  }}
                  disabled={completed}
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  className="flex-1 min-w-0 bg-transparent border-none outline-none font-mono text-xs text-foreground selection:bg-primary/30"
                  style={{ caretColor: "hsl(140 40% 45%)" }}
                  placeholder={completed ? "" : ""}
                />
              </div>

              {completed && (
                <div className="mt-1 font-mono text-xs text-muted-foreground/40 italic">
                  — Case closed. No further queries accepted. —
                </div>
              )}

              <div ref={terminalEndRef} />
            </div>
          </div>

          {/* Schema view */}
          {rightView === "schema" && (
            <SchemaView schema={gameCase.schema} />
          )}
        </div>
      </div>
    </div>
  );
}

// Schema diagram component
function SchemaView({ schema }: { schema: CaseSchema }) {
  return (
    <div className="flex-1 overflow-y-auto bg-[hsl(220,20%,6%)] p-6">
      <div className="mb-5">
        <p className="font-typewriter text-[11px] text-muted-foreground tracking-[0.25em] uppercase">
          Evidence Database — Schema Diagram
        </p>
      </div>

      <div className="flex flex-wrap gap-5">
        {schema.tables.map((table) => (
          <div
            key={table.name}
            className="min-w-[220px] flex-1 max-w-[320px] rounded border border-primary/25 overflow-hidden bg-[hsl(220,20%,9%)] shadow-[0_0_18px_hsl(0_0%_0%/0.4)]"
          >
            {/* Table header */}
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border-b border-primary/25">
              <Database className="w-3 h-3 text-primary/70 shrink-0" />
              <span className="font-typewriter text-xs text-primary tracking-wider uppercase">
                {table.name}
              </span>
            </div>

            {/* Columns */}
            <div className="divide-y divide-border/40">
              {table.columns.map((col) => (
                <div
                  key={col.name}
                  className={`flex items-center gap-2 px-3 py-1.5 ${
                    col.key === "PK"
                      ? "bg-primary/5"
                      : col.key === "FK"
                      ? "bg-noir-green/5"
                      : ""
                  }`}
                >
                  {col.key === "PK" && (
                    <Key className="w-2.5 h-2.5 text-primary/80 shrink-0" />
                  )}
                  {col.key === "FK" && (
                    <Link2 className="w-2.5 h-2.5 text-noir-green/70 shrink-0" />
                  )}
                  {!col.key && (
                    <span className="w-2.5 h-2.5 shrink-0" />
                  )}
                  <span className={`font-mono text-[11px] flex-1 ${
                    col.key === "PK" ? "text-primary" : col.key === "FK" ? "text-noir-green/80" : "text-foreground/75"
                  }`}>
                    {col.name}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground/50 shrink-0">
                    {col.type}
                  </span>
                  {col.key && (
                    <span className={`text-[9px] font-typewriter tracking-wider px-1 rounded border shrink-0 ${
                      col.key === "PK"
                        ? "text-primary/70 border-primary/30 bg-primary/10"
                        : "text-noir-green/70 border-noir-green/30 bg-noir-green/10"
                    }`}>
                      {col.key}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Foreign key references */}
            {table.references && table.references.length > 0 && (
              <div className="border-t border-dashed border-border/40 px-3 py-2 space-y-1">
                <p className="font-typewriter text-[9px] text-muted-foreground/50 tracking-widest uppercase mb-1">
                  Relations
                </p>
                {table.references.map((ref, i) => (
                  <div key={i} className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground/60">
                    <Link2 className="w-2.5 h-2.5 text-noir-green/50 shrink-0" />
                    <span className="text-noir-green/70">{ref.column}</span>
                    <span className="text-muted-foreground/40">→</span>
                    <span className="text-primary/60">{ref.refTable}</span>
                    <span className="text-muted-foreground/40">.</span>
                    <span className="text-primary/80">{ref.refColumn}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-5 pt-4 border-t border-border/30">
        <div className="flex items-center gap-1.5">
          <Key className="w-3 h-3 text-primary/70" />
          <span className="font-typewriter text-[10px] text-muted-foreground/60 tracking-wider">Primary Key</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Link2 className="w-3 h-3 text-noir-green/60" />
          <span className="font-typewriter text-[10px] text-muted-foreground/60 tracking-wider">Foreign Key</span>
        </div>
      </div>
    </div>
  );
}

// Mock result generator
function generateMockResults(caseId: number, objectiveIdx: number, query: string): { rows: Record<string, unknown>[]; error?: string } {
  const q = query.toLowerCase().trim();

  if (!q.startsWith("select")) {
    return { rows: [], error: "Only SELECT queries are allowed, detective." };
  }

  if (caseId === 1) {
    if (objectiveIdx === 0) {
      if (q.includes("citizens") && (q.includes("elena") || q.includes("vasquez") || q.includes("*"))) {
        return { rows: [{ id: 7, first_name: "Elena", last_name: "Vasquez", age: 34, address: "42 River Lane", district: "Riverside", occupation: "Accountant", phone: "555-0147", status: "missing" }] };
      }
      return { rows: [
        { id: 1, first_name: "John", last_name: "Miller", age: 45, address: "12 Oak St", district: "Downtown", occupation: "Lawyer", phone: "555-0101", status: "active" },
        { id: 3, first_name: "Sarah", last_name: "Chen", age: 29, address: "88 Pine Ave", district: "Eastside", occupation: "Teacher", phone: "555-0103", status: "active" },
        { id: 7, first_name: "Elena", last_name: "Vasquez", age: 34, address: "42 River Lane", district: "Riverside", occupation: "Accountant", phone: "555-0147", status: "missing" },
      ]};
    }
    if (objectiveIdx === 1) {
      if (q.includes("sightings")) {
        return { rows: [
          { id: 1, citizen_id: 7, location: "Riverside Cafe", seen_at: "2024-03-12 09:30:00", reported_by: "Officer Davis" },
          { id: 2, citizen_id: 7, location: "5th & Main Warehouse", seen_at: "2024-03-13 22:15:00", reported_by: "Anonymous" },
        ]};
      }
    }
    if (objectiveIdx === 2) {
      if (q.includes("citizens") && q.includes("riverside")) {
        return { rows: [
          { id: 5, first_name: "Marco", last_name: "Rivera", age: 41, address: "38 River Lane", district: "Riverside", occupation: "Mechanic", phone: "555-0130", status: "active" },
          { id: 9, first_name: "Linda", last_name: "Park", age: 52, address: "50 River Lane", district: "Riverside", occupation: "Retired", phone: "555-0160", status: "active" },
          { id: 12, first_name: "Tom", last_name: "Nguyen", age: 28, address: "44 River Lane", district: "Riverside", occupation: "Freelancer", phone: "555-0177", status: "active" },
        ]};
      }
    }
  }

  if (caseId === 2) {
    if (objectiveIdx === 0) {
      if (q.includes("join") && q.includes("bank_accounts")) {
        return { rows: [
          { full_name: "Alice Monroe", bank_name: "First National", balance: 15200 },
          { full_name: "Marcus Webb", bank_name: "City Trust", balance: 87500 },
          { full_name: "David Chen", bank_name: "Pacific Bank", balance: 62300 },
          { full_name: "Marcus Webb", bank_name: "Pacific Bank", balance: 41000 },
          { full_name: "Sofia Grant", bank_name: "First National", balance: 8900 },
          { full_name: "David Chen", bank_name: "City Trust", balance: 23400 },
        ]};
      }
    }
    if (objectiveIdx === 1) {
      if (q.includes("join") && q.includes("ssn_hash")) {
        return { rows: [{ full_name: "Marcus Webb", full_name_2: "David Chen", ssn_hash: "a7f3b2c9d1e5" }] };
      }
    }
    if (objectiveIdx === 2) {
      if (q.includes("left join") && q.includes("id_documents")) {
        return { rows: [
          { full_name: "Marcus Webb", doc_type: "passport", is_valid: false },
          { full_name: "David Chen", doc_type: "driver_license", is_valid: false },
          { full_name: "David Chen", doc_type: null, is_valid: null },
        ]};
      }
    }
  }

  if (caseId === 3) {
    if (objectiveIdx === 0) {
      if (q.includes("group by") && q.includes("district")) {
        return { rows: [
          { district: "Downtown", crime_count: 5 },
          { district: "Westside", crime_count: 2 },
          { district: "Eastside", crime_count: 3 },
          { district: "Harbor", crime_count: 2 },
        ]};
      }
    }
    if (objectiveIdx === 1) {
      if (q.includes("sum") && q.includes("group by")) {
        return { rows: [
          { name: "Viktor Petrov", total: 890000 },
          { name: "Nina Sorokina", total: 340000 },
          { name: "Alexei Volkov", total: 210000 },
          { name: "Dmitri Kask", total: 150000 },
        ]};
      }
    }
    if (objectiveIdx === 2) {
      if (q.includes("having") && q.includes("count")) {
        return { rows: [{ name: "Viktor Petrov", alias: "The Ghost", jobs: 8 }] };
      }
    }
  }

  if (caseId === 4) {
    if (objectiveIdx === 0) {
      if (q.includes("select") && q.includes("clearance_level") && q.includes("avg")) {
        return { rows: [
          { id: 3, name: "Rachel Torres", department: "Security", role: "Head of Security", salary: 95000, clearance_level: 5 },
          { id: 7, name: "James Morton", department: "IT", role: "Systems Admin", salary: 88000, clearance_level: 4 },
          { id: 11, name: "Karen Cho", department: "Management", role: "Director", salary: 120000, clearance_level: 5 },
          { id: 15, name: "Robert Hale", department: "Security", role: "Night Guard Lead", salary: 52000, clearance_level: 4 },
        ]};
      }
    }
    if (objectiveIdx === 1) {
      if (q.includes("access_logs") && q.includes("vault")) {
        return { rows: [
          { name: "Rachel Torres", area: "Vault", accessed_at: "2024-03-15 21:47:00" },
          { name: "Robert Hale", area: "Vault", accessed_at: "2024-03-15 19:00:00" },
        ]};
      }
    }
    if (objectiveIdx === 2) {
      if (q.includes("transactions") && q.includes("salary")) {
        return { rows: [{ name: "Rachel Torres", amount: 200000, salary: 95000 }] };
      }
    }
  }

  return { rows: [{ message: "Query executed but didn't match the current objective. Try a different approach, detective." }] };
}
