"use client";

import { useState, useCallback, useEffect } from "react";

interface GameProgress {
  completedCases: number[];
  completedQuests: string[];
  completedLessons: string[];
  currentObjectives: Record<number, number>;
}

const EMPTY: GameProgress = { completedCases: [], completedQuests: [], completedLessons: [], currentObjectives: {} };
const LS_KEY = "sql-noir-progress";

function loadLocalProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function saveLocalProgress(p: GameProgress) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(p));
  } catch { /* ignore */ }
}

export function useGameProgress() {
  const [progress, setProgress] = useState<GameProgress>(EMPTY);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate: localStorage first (instant), then sync from MongoDB API in background
  useEffect(() => {
    const local = loadLocalProgress();
    setProgress(local);
    setIsLoading(false); // ← Unblock UI immediately with local data

    // Background sync with MongoDB (non-blocking)
    fetch("/api/progress")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: GameProgress | null) => {
        if (!data) return; // MongoDB unavailable — keep local data
        // Merge: take the most advanced of local vs server
        const merged: GameProgress = {
          completedCases: [...new Set([...local.completedCases, ...(data.completedCases ?? [])])],
          completedQuests: [...new Set([...local.completedQuests, ...(data.completedQuests ?? [])])],
          completedLessons: [...new Set([...(local.completedLessons ?? []), ...(data.completedLessons ?? [])])],
          currentObjectives: { ...local.currentObjectives, ...data.currentObjectives },
        };
        setProgress(merged);
        saveLocalProgress(merged);
      })
      .catch(() => { /* MongoDB offline — local progress already loaded */ });
  }, []);

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

  const isQuestCompleted = useCallback(
    (questId: string) => progress.completedQuests.includes(questId),
    [progress]
  );

  const advanceObjective = useCallback(
    async (caseId: number, totalObjectives: number, questId?: string) => {
      setProgress((prev) => {
        const currentIdx = prev.currentObjectives[caseId] ?? 0;
        const nextIdx = currentIdx + 1;
        const caseComplete = nextIdx >= totalObjectives;

        const next: GameProgress = {
          completedCases: caseComplete
            ? [...new Set([...prev.completedCases, caseId])]
            : prev.completedCases,
          completedQuests: questId && !prev.completedQuests.includes(questId)
            ? [...prev.completedQuests, questId]
            : prev.completedQuests,
          completedLessons: prev.completedLessons ?? [],
          currentObjectives: { ...prev.currentObjectives, [caseId]: nextIdx },
        };
        saveLocalProgress(next);
        return next;
      });

      // Persist to MongoDB
      try {
        await fetch("/api/progress/advance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caseId, totalObjectives, questId }),
        });
      } catch { /* offline — localStorage already saved */ }
    },
    []
  );

  const isLessonCompleted = useCallback(
    (lessonId: string) => (progress.completedLessons ?? []).includes(lessonId),
    [progress]
  );

  const markLessonComplete = useCallback(
    async (lessonId: string) => {
      setProgress((prev) => {
        const existing = prev.completedLessons ?? [];
        if (existing.includes(lessonId)) return prev;
        const next: GameProgress = { ...prev, completedLessons: [...existing, lessonId] };
        saveLocalProgress(next);
        return next;
      });
      try {
        await fetch("/api/progress/lesson", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId }),
        });
      } catch { /* offline — localStorage already saved */ }
    },
    []
  );

  const resetProgress = useCallback(async () => {
    setProgress(EMPTY);
    saveLocalProgress(EMPTY);
    try {
      await fetch("/api/progress/reset", { method: "POST" });
    } catch { /* ignore */ }
  }, []);

  return {
    isLoading,
    isCaseUnlocked,
    isCaseCompleted,
    isQuestCompleted,
    getCurrentObjective,
    advanceObjective,
    resetProgress,
    isLessonCompleted,
    markLessonComplete,
    completedQuests: progress.completedQuests,
    completedLessons: progress.completedLessons ?? [],
  };
}
