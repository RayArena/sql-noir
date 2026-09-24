"use client";

import Link from "next/link";
import { BookOpen, CheckCircle, Lock, ArrowLeft, GraduationCap } from "lucide-react";
import { TUTORIALS, type TutorialConcept } from "@/data/tutorials";
import { useGameProgress } from "@/hooks/useGameProgress";
import { useEffect, useState } from "react";

const LEVEL_TITLES: Record<number, string> = {
  1: "The Vanishing Witness",
  2: "The Hotel on Ash Street",
  3: "The Silent Witnesses",
  4: "The Corrupt Precinct",
  5: "The Midnight Exchange",
  6: "The Auction House",
  7: "The Phantom Shipment",
  8: "The Black Ledger",
};

export default function TutorialsPage() {
  const { isLessonCompleted, isLoading } = useGameProgress();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const levels = Array.from(new Set(TUTORIALS.map((t) => t.level))).sort((a, b) => a - b);
  const availableCount = TUTORIALS.filter((t) => t.status === "available").length;
  const doneCount = mounted && !isLoading
    ? TUTORIALS.filter((t) => t.status === "available" && isLessonCompleted(t.id)).length
    : 0;

  return (
    <div className="min-h-screen noir-gradient relative">
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 pt-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <GraduationCap className="w-6 h-6 text-primary" />
          <h1 className="font-typewriter text-3xl text-primary tracking-wider">The SQL Academy</h1>
        </div>
        <p className="font-mono-case text-sm text-muted-foreground ml-11 mb-8 max-w-2xl">
          Every technique DI Kulkarni&apos;s cases demand, taught in the same order the investigation reveals them. Practice each one in a live sandbox before you take it to the field.
        </p>

        {/* Progress strip */}
        <div className="ml-11 mb-10 flex items-center gap-3">
          <div className="h-2 flex-1 max-w-xs bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${availableCount ? (doneCount / availableCount) * 100 : 0}%` }}
            />
          </div>
          <span className="font-mono-case text-xs text-muted-foreground">
            {doneCount}/{availableCount} lessons complete
          </span>
        </div>

        {/* Levels */}
        <div className="space-y-10">
          {levels.map((lvl) => {
            const concepts = TUTORIALS.filter((t) => t.level === lvl);
            return (
              <div key={lvl}>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-typewriter text-xs text-primary/70 tracking-[0.3em] uppercase">
                    Level {lvl}
                  </span>
                  <span className="font-mono-case text-xs text-muted-foreground/60 italic">
                    {LEVEL_TITLES[lvl]}
                  </span>
                  <span className="flex-1 border-b border-border/40" />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {concepts.map((c) => (
                    <ConceptCard
                      key={c.id}
                      concept={c}
                      done={mounted && isLessonCompleted(c.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ConceptCard({ concept, done }: { concept: TutorialConcept; done: boolean }) {
  const soon = concept.status === "coming-soon";

  const inner = (
    <div
      className={`relative border p-4 h-full transition-colors ${
        soon
          ? "border-border/40 bg-card/20 opacity-60"
          : "border-border bg-card/50 hover:border-primary/50 hover:bg-card/70"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {soon ? (
            <Lock className="w-4 h-4 text-muted-foreground/50 shrink-0" />
          ) : done ? (
            <CheckCircle className="w-4 h-4 text-noir-green shrink-0" />
          ) : (
            <BookOpen className="w-4 h-4 text-primary shrink-0" />
          )}
          <span className="font-typewriter text-base text-foreground truncate">{concept.name}</span>
        </div>
        <span className="font-mono-case text-[9px] text-muted-foreground/60 border border-border/50 px-1.5 py-0.5 tracking-wider shrink-0">
          {soon ? "SOON" : concept.keyword}
        </span>
      </div>
      <p className="font-mono-case text-xs text-muted-foreground mt-2 leading-relaxed">
        {concept.tagline}
      </p>
    </div>
  );

  if (soon) return inner;
  return <Link href={`/tutorials/${concept.id}`}>{inner}</Link>;
}
