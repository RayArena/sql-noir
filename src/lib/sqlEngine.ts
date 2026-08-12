/**
 * sqlEngine.ts — sql.js wrapper for in-browser SQLite execution.
 *
 * Usage:
 *   const engine = await createSqlEngine(caseId);
 *   const result = engine.runQuery("SELECT * FROM police_fir_logs");
 *   const validation = engine.submit("suspects", expectedRows);
 */

import type { SqlJsStatic, Database } from "sql.js";
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

let SQL: SqlJsStatic | null = null;

async function getSqlJs(): Promise<SqlJsStatic> {
  if (SQL) return SQL;
  // Dynamically import sql.js — it's a heavy wasm module
  const initSqlJs = (await import("sql.js")).default;
  SQL = await initSqlJs({
    // Map any wasm file request to /public/ (both browser and non-browser variants)
    locateFile: (file: string) => `/${file}`,
  });
  return SQL;
}

export async function createSqlEngine(caseId: number): Promise<SqlEngine> {
  const sqlJs = await getSqlJs();
  const db: Database = new sqlJs.Database();

  // Seed the database with case-specific data
  const seed = CASE_SEEDS[caseId];
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
        // DML statement or empty result
        return { columns: [], rows: [], rowCount: 0, execTime };
      }

      const { columns, values } = results[0];
      const rows = values.map((row) => {
        const obj: Record<string, string | number | null> = {};
        columns.forEach((col, i) => {
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
