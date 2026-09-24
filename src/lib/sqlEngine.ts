/**
 * sqlEngine.ts — sql.js wrapper for in-browser SQLite execution.
 *
 * Loads sql.js by injecting a <script> tag pointing to the bundled file
 * in /public/sql-wasm.js — this avoids Turbopack WASM import issues entirely.
 */

import { CASE_SEEDS } from "@/data/caseSeeds";

export interface QueryResult {
  columns: string[];
  rows: Record<string, string | number | null>[];
  rowCount: number;
  execTime: number;
  error?: string;
}

export interface SqlEngine {
  runQuery: (sql: string) => QueryResult;
  getTableNames: () => string[];
  describeTable: (tableName: string) => QueryResult;
  destroy: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SqlJsStatic = any;

let sqlJsPromise: Promise<SqlJsStatic> | null = null;

function loadSqlJsScript(): Promise<SqlJsStatic> {
  if (sqlJsPromise) return sqlJsPromise;

  sqlJsPromise = new Promise((resolve, reject) => {
    // If already loaded from a previous script injection
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (window as any).initSqlJs !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).initSqlJs({ locateFile: () => "/sql-wasm.wasm" }).then(resolve).catch(reject);
      return;
    }

    const script = document.createElement("script");
    script.src = "/sql-wasm.js";
    script.async = true;
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const initSqlJs = (window as any).initSqlJs;
      if (!initSqlJs) {
        reject(new Error("sql.js failed to expose initSqlJs on window"));
        return;
      }
      initSqlJs({ locateFile: () => "/sql-wasm.wasm" }).then(resolve).catch(reject);
    };
    script.onerror = () => reject(new Error("Failed to load /sql-wasm.js"));
    document.head.appendChild(script);
  });

  return sqlJsPromise;
}

export async function createSqlEngine(source: number | string): Promise<SqlEngine> {
  const SQL = await loadSqlJsScript();
  const db = new SQL.Database();

  // Seed the database. A number selects a case seed; a string is raw DDL/DML
  // (used by the tutorial practice sandbox, which supplies its own schema).
  const seed = typeof source === "string" ? source : CASE_SEEDS[source];
  if (seed) {
    db.run(seed);
  }

  function runQuery(sql: string): QueryResult {
    const start = performance.now();
    try {
      const trimmed = sql.trim();
      if (!trimmed) {
        return { columns: [], rows: [], rowCount: 0, execTime: 0, error: "Empty query." };
      }

      const results = db.exec(trimmed);
      const execTime = performance.now() - start;

      if (results.length === 0) {
        return { columns: [], rows: [], rowCount: 0, execTime };
      }

      const { columns, values } = results[0];
      const rows = values.map((row: (string | number | null)[]) => {
        const obj: Record<string, string | number | null> = {};
        columns.forEach((col: string, i: number) => {
          const val = row[i];
          obj[col] = val === undefined ? null : val as string | number | null;
        });
        return obj;
      });

      return { columns, rows, rowCount: rows.length, execTime };
    } catch (err: unknown) {
      const execTime = performance.now() - start;
      const message = err instanceof Error ? err.message : String(err);
      return { columns: [], rows: [], rowCount: 0, execTime, error: message };
    }
  }

  function getTableNames(): string[] {
    const result = runQuery(
      "SELECT name FROM sqlite_master WHERE type='table' OR type='view' ORDER BY name"
    );
    return result.rows.map((r) => String(r.name));
  }

  function describeTable(tableName: string): QueryResult {
    return runQuery(`PRAGMA table_info(${tableName})`);
  }

  function destroy() {
    db.close();
  }

  return { runQuery, getTableNames, describeTable, destroy };
}
