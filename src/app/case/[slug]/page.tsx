"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Database,
  Key,
  Link2,
  Lightbulb,
  BookOpen,
  TerminalSquare,
  Volume2,
  VolumeX,
} from "lucide-react";
import { CASES } from "@/data/cases";
import { ALL_SCRIPTS } from "@/data/storyScripts";
import type { DialogLine } from "@/data/storyScripts";
import { useGameProgress } from "@/hooks/useGameProgress";
import { useSqlEngine } from "@/hooks/useSqlEngine";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogPlayer } from "@/components/story/DialogPlayer";
import { QuestLog } from "@/components/story/QuestLog";
import { SqlTerminal } from "@/components/terminal/SqlTerminal";
import type { SqlTerminalRef } from "@/components/terminal/SqlTerminal";

type RightView = "terminal" | "schema";
type PhaseState = "arc-intro" | "playing" | "quest-outro" | "arc-outro" | "done";

export default function CasePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const gameCase = CASES.find((c) => c.slug === slug);
  const arcScript = gameCase ? ALL_SCRIPTS[gameCase.id] : null;

  const {
    getCurrentObjective,
    advanceObjective,
    isCaseUnlocked,
    isCaseCompleted,
    completedQuests,
    isLoading: progressLoading,
  } = useGameProgress();

  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<PhaseState>("arc-intro");
  const [rightView, setRightView] = useState<RightView>("terminal");
  const [showHint, setShowHint] = useState<string | null>(null);
  const [pendingDialog, setPendingDialog] = useState<DialogLine[] | null>(null);
  const [pendingDialogTitle, setPendingDialogTitle] = useState<string>("");
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [narratives, setNarratives] = useState<string[]>([]);
  const terminalRef = useRef<SqlTerminalRef | null>(null);

  // sql.js engine
  const dbName = gameCase ? `case_${gameCase.slug.replace(/-/g, "_")}` : "evidence";
  const { isReady, isLoading: dbLoading, runQuery, getTableNames, describeTable } = useSqlEngine(
    gameCase?.id ?? 0
  );

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || progressLoading) return;
    if (!gameCase || gameCase.status === "in-development" || !isCaseUnlocked(gameCase.id)) {
      router.replace("/cases");
    }
  }, [mounted, progressLoading, gameCase, isCaseUnlocked, router]);

  const currentObjIdx = gameCase ? getCurrentObjective(gameCase.id) : 0;
  const isCompleted = gameCase ? isCaseCompleted(gameCase.id) : false;
  const currentObjective = gameCase?.objectives[currentObjIdx];

  // Determine current quest
  const currentQuest = gameCase?.quests.find((q) =>
    q.objectiveIds.includes(currentObjective?.id ?? "")
  );

  // Show arc intro when page first loads
  useEffect(() => {
    if (!mounted || !arcScript || phase !== "arc-intro") return;
    // Small delay so the UI settles first
    const timer = setTimeout(() => {
      if (arcScript.arcIntro.length > 0) {
        setPendingDialog(arcScript.arcIntro);
        setPendingDialogTitle(gameCase?.title ?? "");
        setPhase("playing");
      } else {
        setPhase("playing");
      }
    }, 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, arcScript]);

  // Check for quest intro dialog when quest changes
  const lastQuestIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (!mounted || !arcScript || phase !== "playing") return;
    if (!currentQuest || currentQuest.id === lastQuestIdRef.current) return;
    lastQuestIdRef.current = currentQuest.id;

    const questScript = arcScript.quests.find((q) => q.questId === currentQuest.id);
    if (questScript?.intro && questScript.intro.length > 0) {
      // Only show intro if quest is just starting (first objective of quest)
      const firstObjId = currentQuest.objectiveIds[0];
      if (currentObjective?.id === firstObjId) {
        setPendingDialog(questScript.intro);
        setPendingDialogTitle(currentQuest.title);
      }
    }
  }, [currentQuest, mounted, arcScript, phase, currentObjective]);

  const handleObjectiveValidated = useCallback(
    async () => {
      if (!gameCase || !currentObjective) return;
      const obj = currentObjective;

      // Add narrative
      setNarratives((prev) => [...prev, obj.narrativeAfter]);

      // Print success to terminal
      terminalRef.current?.addLines([
        { type: "output", content: "" },
        { type: "info",   content: `» ${obj.narrativeAfter}` },
        { type: "output", content: "" },
      ]);

      // Check if this completes the quest
      const questToComplete = gameCase.quests.find((q) =>
        q.objectiveIds[q.objectiveIds.length - 1] === obj.id
      );

      // Advance in DB
      await advanceObjective(gameCase.id, gameCase.objectives.length, questToComplete?.id);

      // Show quest outro dialog
      if (questToComplete) {
        const qScript = arcScript?.quests.find((q) => q.questId === questToComplete.id);
        if (qScript?.outro && qScript.outro.length > 0) {
          setTimeout(() => {
            setPendingDialog(qScript.outro);
            setPendingDialogTitle(`Quest Complete — ${questToComplete.title}`);
            setPhase("quest-outro");
          }, 800);
        }
      }
    },
    [gameCase, currentObjective, advanceObjective, arcScript]
  );

  const handleDialogComplete = useCallback(() => {
    setPendingDialog(null);
    setPendingDialogTitle("");

    if (phase === "quest-outro") {
      // Check if entire case is now complete
      const nextObjIdx = currentObjIdx + 1;
      const caseComplete = nextObjIdx >= (gameCase?.objectives.length ?? 0);
      if (caseComplete && arcScript?.arcOutro.length) {
        setTimeout(() => {
          setPendingDialog(arcScript.arcOutro);
          setPendingDialogTitle("Case Closed");
          setPhase("arc-outro");
        }, 300);
      } else {
        setPhase("playing");
        // Show next quest intro if applicable
        const nextObj = gameCase?.objectives[nextObjIdx];
        const nextQuest = gameCase?.quests.find((q) => q.objectiveIds[0] === nextObj?.id);
        if (nextQuest) {
          const nextQScript = arcScript?.quests.find((q) => q.questId === nextQuest.id);
          if (nextQScript?.intro.length) {
            setTimeout(() => {
              setPendingDialog(nextQScript.intro);
              setPendingDialogTitle(nextQuest.title);
            }, 500);
          }
        }
      }
    } else if (phase === "arc-outro") {
      setPhase("done");
    } else {
      setPhase("playing");
    }
  }, [phase, currentObjIdx, gameCase, arcScript]);

  const handleDialogSkip = useCallback(() => {
    setPendingDialog(null);
    setPendingDialogTitle("");
    if (phase === "arc-intro" || phase === "quest-outro") {
      setPhase("playing");
    } else if (phase === "arc-outro") {
      setPhase("done");
    }
  }, [phase]);

  const handleReplayStory = useCallback(
    (questId: string) => {
      const qScript = arcScript?.quests.find((q) => q.questId === questId);
      if (!qScript) return;
      const quest = gameCase?.quests.find((q) => q.id === questId);
      setPendingDialog([...qScript.intro, ...(qScript.outro ?? [])]);
      setPendingDialogTitle(quest?.title ?? "");
    },
    [arcScript, gameCase]
  );

  if (!mounted) return null;
  if (!gameCase || gameCase.status === "in-development" || !isCaseUnlocked(gameCase.id)) return null;

  const difficultyColor: Record<string, string> = {
    "Rookie":           "border-emerald-600/40 text-emerald-400",
    "Detective":        "border-amber-600/40 text-amber-400",
    "Senior Detective": "border-orange-600/40 text-orange-400",
    "Chief Inspector":  "border-red-600/40 text-red-400",
  };

  return (
    <div className="h-screen flex flex-col noir-gradient">
      {/* ── Cinematic Dialog Overlay ── */}
      <AnimatePresence>
        {pendingDialog && (
          <DialogPlayer
            key="dialog"
            lines={pendingDialog}
            title={pendingDialogTitle}
            onComplete={handleDialogComplete}
            onSkip={handleDialogSkip}
          />
        )}
      </AnimatePresence>

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border mt-[57px] bg-[hsl(220,20%,7%)] shrink-0">
        <Link href="/cases" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-typewriter text-primary text-base tracking-wider truncate">
            {gameCase.title}
          </span>
          <Badge className={`font-typewriter text-[10px] border bg-transparent shrink-0 ${difficultyColor[gameCase.difficulty] ?? ""}`}>
            {gameCase.difficulty}
          </Badge>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {isCompleted && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="stamp-effect font-typewriter text-[10px] px-2 py-0.5"
            >
              Case Closed
            </motion.div>
          )}
          {/* DB status dot */}
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              isCompleted
                ? "bg-emerald-500 shadow-[0_0_6px_hsl(140,60%,50%/0.6)]"
                : isReady
                ? "bg-primary/60"
                : "bg-muted-foreground/30 animate-pulse"
            }`}
            title={isReady ? "Database ready" : "Loading database..."}
          />
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT: Quest Log + Case Briefing ── */}
        <div className="w-72 lg:w-80 border-r border-border flex flex-col bg-[hsl(220,20%,7%)]">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-primary/60" />
            <span className="font-typewriter text-xs text-primary tracking-widest uppercase">
              Quest Log
            </span>
          </div>

          <ScrollArea className="flex-1">
            {/* Quest Log */}
            <QuestLog
              gameCase={gameCase}
              completedQuests={completedQuests}
              currentObjIdx={currentObjIdx}
              isCompleted={isCompleted}
              onReplayStory={handleReplayStory}
            />

            {/* Current Objective Detail */}
            {currentObjective && !isCompleted && (
              <div className="px-4 pb-4 space-y-3">
                <div className="border-t border-border/30 pt-3">
                  <p className="font-typewriter text-[9px] text-muted-foreground/50 tracking-[0.3em] uppercase mb-2">
                    Current Objective
                  </p>
                  <div className="rounded border border-primary/20 bg-primary/5 p-3 space-y-2">
                    <p className="font-typewriter text-xs text-primary">{currentObjective.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {currentObjective.description}
                    </p>
                    <button
                      onClick={() => setShowHint(showHint === currentObjective.id ? null : currentObjective.id)}
                      className="flex items-center gap-1.5 text-[10px] text-primary/50 hover:text-primary transition-colors font-mono-case"
                    >
                      <Lightbulb className="w-3 h-3" />
                      {showHint === currentObjective.id ? "Hide hint" : "Need a hint?"}
                    </button>
                    <AnimatePresence>
                      {showHint === currentObjective.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-primary/10 border border-primary/20 rounded p-2"
                        >
                          <code className="text-[10px] text-primary/80 font-mono leading-relaxed whitespace-pre-wrap break-all">
                            {currentObjective.hint}
                          </code>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )}

            {/* Narrative log */}
            {narratives.length > 0 && (
              <div className="px-4 pb-6 space-y-2">
                <p className="font-typewriter text-[9px] text-muted-foreground/40 tracking-[0.3em] uppercase">
                  Case Notes
                </p>
                {narratives.map((n, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="case-file rounded p-2.5"
                  >
                    <p className="font-mono-case text-noir-ink/75 text-[10px] italic leading-relaxed">{n}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* ── RIGHT: Terminal / Schema ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Tab bar */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-[hsl(220,20%,5%)] shrink-0">
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
              {/* Mute toggle */}
              <button
                onClick={() => setVoiceMuted((v) => !v)}
                className="p-1 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                title={voiceMuted ? "Enable voice narration" : "Mute voice narration"}
              >
                {voiceMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <span className="font-mono text-[10px] text-muted-foreground/30 tracking-widest">
                {dbLoading ? "loading..." : isReady ? dbName : "offline"}
              </span>
            </div>
          </div>

          {/* Terminal panel */}
          <div className={`flex-1 overflow-hidden ${rightView !== "terminal" ? "hidden" : ""}`}>
            <SqlTerminal
              ref={terminalRef}
              dbName={dbName}
              isReady={isReady}
              isLoading={dbLoading}
              isCompleted={isCompleted}
              onRunQuery={runQuery}
              onGetTableNames={getTableNames}
              onDescribeTable={describeTable}
              currentObjective={currentObjective}
              onObjectiveValidated={handleObjectiveValidated}
            />
          </div>

          {/* Schema panel */}
          {rightView === "schema" && (
            <SchemaView schema={gameCase.schema} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Schema View ────────────────────────────────────────────────────────────────
function SchemaView({ schema }: { schema: import("@/data/cases").CaseSchema }) {
  return (
    <div className="flex-1 overflow-y-auto bg-[hsl(220,25%,5%)] p-6">
      <p className="font-typewriter text-[11px] text-muted-foreground tracking-[0.25em] uppercase mb-5">
        Evidence Database — Schema Diagram
      </p>
      <div className="flex flex-wrap gap-5">
        {schema.tables.map((table) => (
          <div
            key={table.name}
            className="min-w-[220px] flex-1 max-w-[320px] rounded border border-primary/25 overflow-hidden bg-[hsl(220,20%,8%)] shadow-lg"
          >
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border-b border-primary/25">
              <Database className="w-3 h-3 text-primary/70 shrink-0" />
              <span className="font-typewriter text-xs text-primary tracking-wider uppercase">
                {table.name}
              </span>
            </div>
            <div className="divide-y divide-border/40">
              {table.columns.map((col) => (
                <div
                  key={col.name}
                  className={`flex items-center gap-2 px-3 py-1.5 ${
                    col.key === "PK" ? "bg-primary/5" : col.key === "FK" ? "bg-emerald-900/10" : ""
                  }`}
                >
                  {col.key === "PK" && <Key className="w-2.5 h-2.5 text-primary/80 shrink-0" />}
                  {col.key === "FK" && <Link2 className="w-2.5 h-2.5 text-emerald-600/70 shrink-0" />}
                  {!col.key && <span className="w-2.5 h-2.5 shrink-0" />}
                  <span className={`font-mono text-[11px] flex-1 ${
                    col.key === "PK" ? "text-primary" : col.key === "FK" ? "text-emerald-400/80" : "text-foreground/75"
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
                        : "text-emerald-400/70 border-emerald-600/30 bg-emerald-900/20"
                    }`}>
                      {col.key}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {table.references && table.references.length > 0 && (
              <div className="border-t border-dashed border-border/40 px-3 py-2 space-y-1">
                <p className="font-typewriter text-[9px] text-muted-foreground/50 tracking-widest uppercase mb-1">
                  Relations
                </p>
                {table.references.map((ref, i) => (
                  <div key={i} className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground/60">
                    <Link2 className="w-2.5 h-2.5 text-emerald-600/50 shrink-0" />
                    <span className="text-emerald-400/70">{ref.column}</span>
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
      <div className="mt-6 flex items-center gap-5 pt-4 border-t border-border/30">
        <div className="flex items-center gap-1.5">
          <Key className="w-3 h-3 text-primary/70" />
          <span className="font-typewriter text-[10px] text-muted-foreground/60 tracking-wider">Primary Key</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Link2 className="w-3 h-3 text-emerald-600/60" />
          <span className="font-typewriter text-[10px] text-muted-foreground/60 tracking-wider">Foreign Key</span>
        </div>
      </div>
    </div>
  );
}
