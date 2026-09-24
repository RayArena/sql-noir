"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { SqlEngine, QueryResult } from "@/lib/sqlEngine";

interface UseSqlEngineReturn {
  isReady: boolean;
  isLoading: boolean;
  runQuery: (sql: string) => QueryResult | null;
  getTableNames: () => string[];
  describeTable: (tableName: string) => QueryResult | null;
  error: string | null;
  reload: () => void;
}

/**
 * Runs a sql.js database for a case (by numeric id) or for an arbitrary raw
 * seed string (used by the tutorial practice sandbox).
 */
export function useSqlEngine(source: number | string): UseSqlEngineReturn {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);
  const engineRef = useRef<SqlEngine | null>(null);

  const reload = useCallback(() => {
    setReloadCounter((c) => c + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setIsReady(false);
    setError(null);

    // Destroy previous engine if switching cases or reloading
    if (engineRef.current) {
      engineRef.current.destroy();
      engineRef.current = null;
    }

    import("@/lib/sqlEngine").then(({ createSqlEngine }) =>
      createSqlEngine(source)
    ).then((engine) => {
      if (cancelled) {
        engine.destroy();
        return;
      }
      engineRef.current = engine;
      setIsReady(true);
      setIsLoading(false);
    }).catch((err) => {
      if (!cancelled) {
        setError(String(err?.message ?? err));
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [source, reloadCounter]);

  const runQuery = useCallback((sql: string): QueryResult | null => {
    if (!engineRef.current) return null;
    return engineRef.current.runQuery(sql);
  }, []);

  const getTableNames = useCallback((): string[] => {
    if (!engineRef.current) return [];
    return engineRef.current.getTableNames();
  }, []);

  const describeTable = useCallback((tableName: string): QueryResult | null => {
    if (!engineRef.current) return null;
    return engineRef.current.describeTable(tableName);
  }, []);

  return { isReady, isLoading, runQuery, getTableNames, describeTable, error, reload };
}
