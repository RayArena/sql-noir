import { useState, useCallback } from "react";

interface GameProgress {
  completedCases: number[];
  currentObjectives: Record<number, number>; // caseId -> objective index
}

const STORAGE_KEY = "sql-noir-progress";

function loadProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { completedCases: [], currentObjectives: {} };
}

function saveProgress(p: GameProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function useGameProgress() {
  const [progress, setProgress] = useState<GameProgress>(loadProgress);

  const isCaseUnlocked = useCallback(
    (caseId: number) => {
      if (caseId === 1) return true;
      return progress.completedCases.includes(caseId - 1);
    },
    [progress]
  );

  const isCaseCompleted = useCallback(
    (caseId: number) => progress.completedCases.includes(caseId),
    [progress]
  );

  const getCurrentObjective = useCallback(
    (caseId: number) => progress.currentObjectives[caseId] ?? 0,
    [progress]
  );

  const advanceObjective = useCallback((caseId: number, totalObjectives: number) => {
    setProgress((prev) => {
      const currentIdx = prev.currentObjectives[caseId] ?? 0;
      const nextIdx = currentIdx + 1;
      const completed = nextIdx >= totalObjectives;
      const newProgress: GameProgress = {
        completedCases: completed
          ? [...new Set([...prev.completedCases, caseId])]
          : prev.completedCases,
        currentObjectives: {
          ...prev.currentObjectives,
          [caseId]: nextIdx,
        },
      };
      saveProgress(newProgress);
      return newProgress;
    });
  }, []);

  const resetProgress = useCallback(() => {
    const fresh: GameProgress = { completedCases: [], currentObjectives: {} };
    saveProgress(fresh);
    setProgress(fresh);
  }, []);

  return { isCaseUnlocked, isCaseCompleted, getCurrentObjective, advanceObjective, resetProgress };
}
