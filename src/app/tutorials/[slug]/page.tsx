"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Eye,
  Info,
  AlertTriangle,
  GraduationCap,
} from "lucide-react";
import {
  TUTORIALS,
  getTutorial,
  TRAINING_SEED,
  type LessonBlock,
} from "@/data/tutorials";
import type { CaseObjective } from "@/data/cases";
import { useGameProgress } from "@/hooks/useGameProgress";
import { useSqlEngine } from "@/hooks/useSqlEngine";
import { SqlTerminal, type SqlTerminalRef } from "@/components/terminal/SqlTerminal";

const AVAILABLE = TUTORIALS.filter((t) => t.status === "available");

export default function LessonPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const concept = getTutorial(slug);

  const {
    isLessonCompleted,
    markLessonComplete,
    isLoading: progressLoading,
  } = useGameProgress();
  const [mounted, setMounted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solved, setSolved] = useState(false);
  const terminalRef = useRef<SqlTerminalRef | null>(null);

  const { isReady, isLoading: dbLoading, runQuery, getTableNames, describeTable } =
    useSqlEngine(TRAINING_SEED);

  useEffect(() => setMounted(true), []);

  // Redirect invalid or not-yet-available concepts back to the index.
  useEffect(() => {
    if (!mounted) return;
    if (!concept || concept.status !== "available") router.replace("/tutorials");
  }, [mounted, concept, router]);

  const alreadyDone =
    mounted && !progressLoading && concept ? isLessonCompleted(concept.id) : false;

  // Build a synthetic CaseObjective from the concept's practice exercise so the
  // SqlTerminal (same component the cases use) can validate the learner's query.
  const objective: CaseObjective | undefined = useMemo(() => {
    if (!concept?.exercise) return undefined;
    const ex = concept.exercise;
    return {
      id: `tut-${concept.id}`,
      title: concept.name,
      description: ex.prompt,
      hint: ex.hint,
      questId: `tut-${concept.id}`,
      validationFn: ex.validationFn,
      successMessage: ex.successMessage,
      narrativeAfter: ex.successMessage,
    };
  }, [concept]);

  const handleValidated = useCallback(() => {
    if (!concept) return;
    setSolved(true);
    void markLessonComplete(concept.id);
    terminalRef.current?.addLines([
      { type: "output", content: "" },
      { type: "success", content: `✓ Lesson complete — ${concept.name} logged to your training record.` },
      { type: "output", content: "" },
    ]);
  }, [concept, markLessonComplete]);

  if (!mounted || !concept || concept.status !== "available") return null;

  const idx = AVAILABLE.findIndex((t) => t.id === concept.id);
  const prev = idx > 0 ? AVAILABLE[idx - 1] : null;
  const next = idx >= 0 && idx < AVAILABLE.length - 1 ? AVAILABLE[idx + 1] : null;
  const done = solved || alreadyDone;

  return (
    <div className="min-h-screen noir-gradient">
      <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
        {/* Breadcrumb + title */}
        <div className="flex items-center gap-3 mb-1">
          <Link
            href="/tutorials"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <GraduationCap className="w-5 h-5 text-primary/70" />
          <span className="font-mono-case text-xs text-muted-foreground tracking-wider uppercase">
            Level {concept.level} · SQL Academy
          </span>
          {done && (
            <span className="ml-auto flex items-center gap-1.5 font-mono-case text-xs text-noir-green">
              <CheckCircle className="w-4 h-4" /> Completed
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-3 mb-6">
          <h1 className="font-typewriter text-3xl text-primary tracking-wider">
            {concept.name}
          </h1>
          <span className="font-mono-case text-[10px] text-muted-foreground/60 border border-border/50 px-1.5 py-0.5 tracking-wider">
            {concept.keyword}
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* LEFT — lesson content */}
          <div className="space-y-4">
            {concept.blocks.map((block, i) => (
              <LessonBlockView key={i} block={block} />
            ))}
          </div>

          {/* RIGHT — practice sandbox */}
          <div className="lg:sticky lg:top-24 space-y-3">
            {objective ? (
              <>
                <div className="border border-primary/25 bg-primary/5 p-4">
                  <p className="font-typewriter text-[10px] text-primary/60 tracking-[0.3em] uppercase mb-2">
                    Practice
                  </p>
                  <p className="font-mono-case text-sm text-foreground leading-relaxed">
                    {objective.description}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => setShowHint((v) => !v)}
                      className="flex items-center gap-1.5 text-[11px] text-primary/60 hover:text-primary transition-colors font-mono-case"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      {showHint ? "Hide hint" : "Need a hint?"}
                    </button>
                    <button
                      onClick={() => setShowSolution((v) => !v)}
                      className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors font-mono-case"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {showSolution ? "Hide solution" : "Reveal solution"}
                    </button>
                  </div>
                  <AnimatePresence>
                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 overflow-hidden"
                      >
                        <code className="block bg-primary/10 border border-primary/20 rounded p-2 text-[11px] text-primary/80 font-mono leading-relaxed whitespace-pre-wrap break-all">
                          {concept.exercise!.hint}
                        </code>
                      </motion.div>
                    )}
                    {showSolution && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 overflow-hidden"
                      >
                        <code className="block bg-secondary/40 border border-border rounded p-2 text-[11px] text-foreground/80 font-mono leading-relaxed whitespace-pre-wrap break-all">
                          submit({concept.exercise!.solution})
                        </code>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="border border-border h-[460px] overflow-hidden">
                  <SqlTerminal
                    ref={terminalRef}
                    dbName="training_dossier"
                    isReady={isReady}
                    isLoading={dbLoading}
                    isCompleted={false}
                    onRunQuery={runQuery}
                    onGetTableNames={getTableNames}
                    onDescribeTable={describeTable}
                    currentObjective={objective}
                    onObjectiveValidated={handleValidated}
                  />
                </div>
                <p className="font-mono-case text-[10px] text-muted-foreground/50 leading-relaxed">
                  Sandbox tables: <span className="text-muted-foreground/80">suspects</span>,{" "}
                  <span className="text-muted-foreground/80">crimes</span>. Explore with plain{" "}
                  <span className="text-muted-foreground/80">SELECT</span>, then wrap your answer in{" "}
                  <span className="text-muted-foreground/80">submit(...)</span> to check it.
                </p>
              </>
            ) : (
              <div className="border border-border/50 bg-card/30 p-6 text-center">
                <p className="font-mono-case text-sm text-muted-foreground">
                  This lesson is reading-only — no practice exercise yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Prev / Next */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/40">
          {prev ? (
            <Link
              href={`/tutorials/${prev.id}`}
              className="flex items-center gap-2 font-mono-case text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/tutorials/${next.id}`}
              className="flex items-center gap-2 font-mono-case text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {next.name}
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/tutorials"
              className="flex items-center gap-2 font-mono-case text-xs text-primary/70 hover:text-primary transition-colors"
            >
              Back to the Academy
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Lesson block renderer ─────────────────────────────────────────────────────
function LessonBlockView({ block }: { block: LessonBlock }) {
  if (block.kind === "text") {
    return (
      <p className="font-mono-case text-sm text-foreground/85 leading-relaxed">
        {block.body}
      </p>
    );
  }
  if (block.kind === "code") {
    return (
      <div className="space-y-1.5">
        <pre className="bg-[hsl(220,25%,5%)] border border-border rounded p-3 overflow-x-auto">
          <code className="font-mono text-[12px] text-[hsl(140,60%,60%)] whitespace-pre leading-relaxed">
            {block.body}
          </code>
        </pre>
        {block.caption && (
          <p className="font-mono-case text-[11px] text-muted-foreground/60 italic leading-relaxed pl-1">
            {block.caption}
          </p>
        )}
      </div>
    );
  }
  if (block.kind === "tip") {
    return (
      <div className="flex gap-2.5 border-l-2 border-primary/50 bg-primary/5 px-3 py-2.5">
        <Info className="w-4 h-4 text-primary/70 shrink-0 mt-0.5" />
        <p className="font-mono-case text-[13px] text-foreground/80 leading-relaxed">
          {block.body}
        </p>
      </div>
    );
  }
  // warning
  return (
    <div className="flex gap-2.5 border-l-2 border-amber-600/60 bg-amber-900/10 px-3 py-2.5">
      <AlertTriangle className="w-4 h-4 text-amber-500/80 shrink-0 mt-0.5" />
      <p className="font-mono-case text-[13px] text-foreground/80 leading-relaxed">
        {block.body}
      </p>
    </div>
  );
}
