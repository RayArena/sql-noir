"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Lock, ChevronRight, BookOpen } from "lucide-react";
import type { GameCase } from "@/data/cases";

interface QuestLogProps {
  gameCase: GameCase;
  completedQuests: string[];
  currentObjIdx: number;
  isCompleted: boolean;
  onReplayStory: (questId: string) => void;
}

export function QuestLog({
  gameCase,
  completedQuests,
  currentObjIdx,
  isCompleted,
  onReplayStory,
}: QuestLogProps) {
  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Arc title */}
      <div className="flex items-center gap-2 mb-1">
        <BookOpen className="w-4 h-4 text-primary/60 shrink-0" />
        <span className="font-typewriter text-xs text-primary tracking-widest uppercase">
          {gameCase.title}
        </span>
      </div>

      {/* Quest chain */}
      <div className="relative space-y-0">
        {gameCase.quests.map((quest, qIdx) => {
          const isDone = completedQuests.includes(quest.id);
          // A quest is active if it's the first undone quest
          const isActive = !isDone && gameCase.quests.slice(0, qIdx).every((q) => completedQuests.includes(q.id));
          const isLocked = !isDone && !isActive;

          // Count objectives that belong to this quest
          const questObjIds = new Set(quest.objectiveIds);
          const questObjs = gameCase.objectives.filter((o) => questObjIds.has(o.id));
          const doneCount = questObjs.filter((_, i) => {
            // Figure out the global objective index
            const globalIdx = gameCase.objectives.findIndex((o) => o.id === questObjs[i].id);
            return globalIdx < currentObjIdx || isCompleted;
          }).length;

          return (
            <div key={quest.id} className="relative">
              {/* Connector line */}
              {qIdx < gameCase.quests.length - 1 && (
                <div
                  className={`absolute left-[11px] top-8 w-px h-6 ${isDone ? "bg-emerald-600/40" : "bg-border/40"}`}
                />
              )}

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: qIdx * 0.08 }}
                className={`rounded-lg border p-3 mb-2 transition-all ${
                  isDone
                    ? "border-emerald-800/30 bg-emerald-950/20"
                    : isActive
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/30 bg-secondary/10 opacity-50"
                }`}
              >
                {/* Quest header */}
                <div className="flex items-center gap-2.5">
                  {isDone ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : isActive ? (
                    <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    </div>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span
                      className={`font-typewriter text-xs tracking-wide ${
                        isDone ? "text-emerald-400" : isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {quest.title}
                    </span>
                    {(isActive || isDone) && (
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{quest.description}</p>
                    )}
                  </div>
                  {isDone && (
                    <button
                      onClick={() => onReplayStory(quest.id)}
                      className="shrink-0 text-emerald-600/50 hover:text-emerald-400 transition-colors"
                      title="Replay story"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Objective mini-list (only for active quest) */}
                {isActive && questObjs.length > 0 && (
                  <div className="mt-2.5 ml-6 space-y-1.5 border-l border-border/30 pl-3">
                    {questObjs.map((obj, oIdx) => {
                      const globalIdx = gameCase.objectives.findIndex((o) => o.id === obj.id);
                      const objDone = globalIdx < currentObjIdx || isCompleted;
                      const objActive = globalIdx === currentObjIdx && !isCompleted;
                      return (
                        <div key={obj.id} className="flex items-start gap-2">
                          {objDone ? (
                            <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                          ) : objActive ? (
                            <ChevronRight className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-3 h-3 text-muted-foreground/40 shrink-0 mt-0.5" />
                          )}
                          <span
                            className={`text-[10px] leading-snug ${
                              objDone ? "text-emerald-400/70" : objActive ? "text-foreground/80" : "text-muted-foreground/50"
                            }`}
                          >
                            {obj.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Progress bar for active quest */}
                {isActive && questObjs.length > 0 && (
                  <div className="mt-2.5 ml-6">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] text-muted-foreground/50 font-mono tracking-wider">
                        PROGRESS
                      </span>
                      <span className="text-[9px] text-primary/60 font-mono">
                        {doneCount}/{questObjs.length}
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-border/30 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/70 transition-all duration-500"
                        style={{ width: `${(doneCount / questObjs.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
