"use client";

import { useState, useCallback, useEffect } from "react";

interface GameProgress {
  completedCases: number[];
  currentObjectives: Record<number, number>; // caseId -> objective index
}

const EMPTY: GameProgress = { completedCases: [], currentObjectives: {} };

export function useGameProgress() {
  const [progress, setProgress] = useState<GameProgress>(EMPTY);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from Supabase via API route on mount
  useEffect(() => {
    let cancelled = false;
    fetch("/api/progress")
      .then((r) => (r.ok ? r.json() : EMPTY))
      .then((data: GameProgress) => {
        if (!cancelled) {
          setProgress(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const isCaseUnlocked = useCallback(
    (caseId: number) => {
      if (caseId === 1) return true;
      if (isLoading) return false;
      return progress.completedCases.includes(caseId - 1);
    },
    [progress, isLoading]
  );

  const isCaseCompleted = useCallback(
    (caseId: number) => {
      if (isLoading) return false;
      return progress.completedCases.includes(caseId);
    },
    [progress, isLoading]
  );

  const getCurrentObjective = useCallback(
    (caseId: number) => progress.currentObjectives[caseId] ?? 0,
    [progress]
  );

  const advanceObjective = useCallback(
    async (caseId: number, totalObjectives: number) => {
      // Optimistic update first
      setProgress((prev) => {
        const currentIdx = prev.currentObjectives[caseId] ?? 0;
        const nextIdx = currentIdx + 1;
        const completed = nextIdx >= totalObjectives;
        return {
          completedCases: completed
            ? [...new Set([...prev.completedCases, caseId])]
            : prev.completedCases,
          currentObjectives: { ...prev.currentObjectives, [caseId]: nextIdx },
        };
      });

      // Persist to Supabase
      await fetch("/api/progress/advance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, totalObjectives }),
      });
    },
    []
  );

  const resetProgress = useCallback(async () => {
    setProgress(EMPTY);
    await fetch("/api/progress/reset", { method: "POST" });
  }, []);

  return {
    isLoading,
    isCaseUnlocked,
    isCaseCompleted,
    getCurrentObjective,
    advanceObjective,
    resetProgress,
  };
}
