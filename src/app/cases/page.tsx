"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, CheckCircle, ArrowLeft, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { CASES } from "@/data/cases";
import { useGameProgress } from "@/hooks/useGameProgress";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type FlipDir = "forward" | "backward";

const difficultyLabel: Record<string, { text: string; color: string }> = {
  Rookie:            { text: "ROOKIE",           color: "text-emerald-700 border-emerald-600/50" },
  Detective:         { text: "DETECTIVE",         color: "text-amber-700   border-amber-600/50"   },
  "Senior Detective":{ text: "SR. DETECTIVE",     color: "text-orange-700  border-orange-600/50"  },
  "Chief Inspector": { text: "CHIEF INSPECTOR",   color: "text-red-700     border-red-600/50"     },
};

export default function CasesPage() {
  const router = useRouter();
  const { isCaseUnlocked, isCaseCompleted } = useGameProgress();
  const [mounted, setMounted] = useState(false);
  // 0 = folder cover, 1..4 = case pages
  const [pageIndex, setPageIndex] = useState(0);
  const [flipDir, setFlipDir] = useState<FlipDir>("forward");
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const totalPages = CASES.length + 1; // cover + one per case

  const navigate = (dir: FlipDir) => {
    if (isFlipping) return;
    const next = dir === "forward" ? pageIndex + 1 : pageIndex - 1;
    if (next < 0 || next >= totalPages) return;
    setFlipDir(dir);
    setIsFlipping(true);
    setTimeout(() => {
      setPageIndex(next);
      setIsFlipping(false);
    }, 400);
  };

  const jumpTo = (idx: number) => {
    if (isFlipping || idx === pageIndex) return;
    setFlipDir(idx > pageIndex ? "forward" : "backward");
    setIsFlipping(true);
    setTimeout(() => {
      setPageIndex(idx);
      setIsFlipping(false);
    }, 400);
  };

  const caseData = pageIndex > 0 ? CASES[pageIndex - 1] : null;
  const unlocked = caseData && mounted ? isCaseUnlocked(caseData.id) : caseData?.id === 1;
  const completed = caseData && mounted ? isCaseCompleted(caseData.id) : false;

  return (
    <div className="h-screen flex flex-col noir-gradient overflow-hidden">
      {/* top bar */}
      <div className="flex items-center gap-3 px-6 py-3 mt-[57px] border-b border-border/40 shrink-0">
        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <FileText className="w-4 h-4 text-primary/50" />
        <span className="font-typewriter text-primary tracking-widest text-sm">ACTIVE CASE FILES — PRECINCT 47</span>
        <span className="ml-auto font-mono-case text-muted-foreground/40 text-xs tracking-widest">
          {pageIndex === 0 ? "COVER" : `FILE ${pageIndex} / ${CASES.length}`}
        </span>
      </div>

      {/* Book area */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden px-14 py-6">

        {/* Left arrow */}
        <button
          onClick={() => navigate("backward")}
          disabled={pageIndex === 0 || isFlipping}
          aria-label="Previous page"
          className={`absolute left-3 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all border
            ${pageIndex === 0
              ? "opacity-0 pointer-events-none"
              : "opacity-50 hover:opacity-100 border-border/50 hover:border-primary/40 text-muted-foreground hover:text-primary hover:bg-primary/8"}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => navigate("forward")}
          disabled={pageIndex === totalPages - 1 || isFlipping}
          aria-label="Next page"
          className={`absolute right-3 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all border
            ${pageIndex === totalPages - 1
              ? "opacity-0 pointer-events-none"
              : "opacity-50 hover:opacity-100 border-border/50 hover:border-primary/40 text-muted-foreground hover:text-primary hover:bg-primary/8"}`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Folder + pages */}
        <div className="relative w-full max-w-2xl h-full max-h-[600px]"
             style={{ perspective: "2400px" }}>

          {/* Stacked pages behind (depth illusion) */}
          {[3, 2, 1].map((offset) => (
            <div
              key={offset}
              className="absolute inset-0 rounded-b-sm rounded-tr-sm"
              style={{
                background: `hsl(${40 - offset * 2} ${25 - offset * 2}% ${88 - offset * 2}%)`,
                top: `${offset * 3}px`,
                left: `${offset * 2}px`,
                right: `-${offset * 2}px`,
                boxShadow: "2px 2px 10px rgba(0,0,0,0.35)",
                zIndex: offset,
              }}
            />
          ))}

          {/* Animated page */}
          <div className="absolute inset-0 z-20" style={{ transformStyle: "preserve-3d" }}>
            <AnimatePresence mode="sync">
              <motion.div
                key={pageIndex}
                initial={{
                  rotateY: flipDir === "forward" ? 90 : -90,
                  y: 0,
                  opacity: 0,
                  transformOrigin: "left center",
                }}
                animate={{ rotateY: 0, y: 0, opacity: 1, transformOrigin: "left center" }}
                exit={{
                  rotateY: flipDir === "forward" ? -90 : 90,
                  y: 0,
                  opacity: 0,
                  transformOrigin: "left center",
                }}
                transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
                className="absolute inset-0 rounded-b-sm rounded-tr-sm overflow-hidden"
                style={{
                  background: "hsl(40 25% 88%)",
                  boxShadow: "4px 4px 24px rgba(0,0,0,0.55), inset 0 0 60px hsl(30 30% 30% / 0.08)",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  willChange: "transform",
                }}
              >
                {/* Red margin line */}
                <div className="absolute left-14 top-0 bottom-0 w-px bg-red-400/35 z-0 pointer-events-none" />

                {/* Ruled lines */}
                <div
                  className="absolute inset-0 z-0 pointer-events-none opacity-30"
                  style={{
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 29px, hsl(30 30% 40% / 0.22) 29px, hsl(30 30% 40% / 0.22) 30px)",
                    backgroundPositionY: "62px",
                  }}
                />

                {/* Page content */}
                <div
                  className="relative z-10 h-full flex"
                  style={{ paddingLeft: pageIndex === 0 ? undefined : 56 }}
                >
                  {/* Left margin gutter */}
                  <div className="w-14 shrink-0 flex flex-col items-center pt-10 gap-5 opacity-30">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="w-3 h-px bg-noir-ink/40" />
                    ))}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 overflow-y-auto scrollbar-hide pr-8 pl-2 py-6">
                    {pageIndex === 0 ? (
                      <FolderCover onOpen={() => navigate("forward")} />
                    ) : (
                      <CaseFilePage
                        caseData={CASES[pageIndex - 1]}
                        unlocked={!!unlocked}
                        completed={!!completed}
                        onOpen={() => router.push(`/case/${CASES[pageIndex - 1].slug}`)}
                      />
                    )}
                  </div>
                </div>

                {/* Page number footer */}
                <div className="absolute bottom-0 left-0 right-0 border-t border-noir-ink/10 px-6 py-1.5 flex justify-between z-10"
                     style={{ background: "hsl(40 25% 85% / 0.6)" }}>
                  <span className="font-mono-case text-[9px] text-noir-ink/35">PRECINCT 47 · CONFIDENTIAL</span>
                  <span className="font-mono-case text-[9px] text-noir-ink/35">
                    {pageIndex === 0 ? "COVER" : `PG. ${pageIndex}`}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Page indicator dots */}
      <div className="flex items-center justify-center gap-2 pb-4 shrink-0">
        {Array.from({ length: totalPages }).map((_, i) => {
          const isCasePage = i > 0;
          const c = isCasePage ? CASES[i - 1] : null;
          const done = c && mounted && isCaseCompleted(c.id);
          return (
            <button
              key={i}
              onClick={() => jumpTo(i)}
              title={i === 0 ? "Cover" : `Case ${i}`}
              className={`rounded-full transition-all ${
                i === pageIndex
                  ? "w-6 h-2 bg-primary"
                  : done
                  ? "w-2 h-2 bg-emerald-600/70 hover:bg-emerald-500"
                  : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

// ── Cover page ────────────────────────────────────────────────────────────────
function FolderCover({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex flex-col gap-6 min-h-full pb-10">
      {/* Stamp top-right area */}
      <div className="flex justify-end">
        <div className="stamp-effect text-[11px] font-typewriter px-3 py-1">
          Active
        </div>
      </div>

      {/* Title block */}
      <div className="space-y-2">
        <p className="font-mono-case text-noir-ink/40 text-[10px] tracking-[0.3em] uppercase">
          City of Noir · Department of Investigations
        </p>
        <h1 className="font-typewriter text-5xl text-noir-ink leading-tight tracking-wide">
          Case Files
        </h1>
        <p className="font-typewriter text-xl text-noir-ink/60 tracking-wider">Precinct 47</p>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-noir-ink/15" />

      {/* Summary box */}
      <div className="rounded border border-noir-ink/15 bg-noir-ink/5 p-4 space-y-2">
        <p className="font-mono-case text-noir-ink/50 text-[10px] tracking-widest uppercase">Contents</p>
        {CASES.map((c, i) => (
          <div key={c.id} className="flex items-center gap-2 font-mono-case text-xs text-noir-ink/70">
            <span className="text-noir-ink/35">File {String(i + 1).padStart(2, "0")}</span>
            <span className="flex-1 border-b border-dotted border-noir-ink/20" />
            <span>{c.title}</span>
          </div>
        ))}
      </div>

      {/* Description */}
      <p className="font-mono-case text-noir-ink/65 text-xs leading-relaxed">
        This dossier contains classified investigation files. Each case requires successful completion of prior assignments before access is granted. Destroy after review.
      </p>

      {/* Open button */}
      <div className="mt-auto pt-4">
        <button
          onClick={onOpen}
          className="flex items-center gap-2 font-typewriter text-sm tracking-wider text-noir-ink/60 hover:text-noir-ink transition-colors border-b border-dashed border-noir-ink/30 hover:border-noir-ink pb-0.5 group"
        >
          Open First Case
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

// ── Individual case file page ─────────────────────────────────────────────────
function CaseFilePage({
  caseData,
  unlocked,
  completed,
  onOpen,
}: {
  caseData: (typeof CASES)[number];
  unlocked: boolean;
  completed: boolean;
  onOpen: () => void;
}) {
  const diff = difficultyLabel[caseData.difficulty] ?? { text: caseData.difficulty.toUpperCase(), color: "text-noir-ink/60 border-noir-ink/30" };

  if (!unlocked) {
    return (
      <div className="flex flex-col gap-5 min-h-full pb-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono-case text-noir-ink/40 text-[10px] tracking-widest">
              CASE #{String(caseData.id).padStart(3, "0")}
            </p>
            <h2 className="font-typewriter text-3xl text-noir-ink/30 mt-1 select-none">
              ████████████████
            </h2>
            <p className="font-mono-case text-xs text-noir-ink/20 italic mt-0.5 select-none">█████ ██ ████</p>
          </div>
          <div className={`font-typewriter text-[10px] border px-2 py-0.5 tracking-widest opacity-30 ${diff.color}`}>
            {diff.text}
          </div>
        </div>

        {/* Classified block */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-10">
          <Lock className="w-12 h-12 text-noir-ink/20" />
          <div className="stamp-effect font-typewriter text-2xl px-8 py-3">Classified</div>
          <p className="font-mono-case text-noir-ink/40 text-xs text-center leading-relaxed mt-4 max-w-xs">
            Access restricted. Complete the previous investigation to unlock this file.
          </p>
        </div>

        {/* Redacted lines */}
        <div className="space-y-2 opacity-15 select-none pointer-events-none mt-auto">
          {[80, 95, 65, 85, 70].map((w, i) => (
            <div key={i} className="h-3 rounded bg-noir-ink/30" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 min-h-full pb-10 relative">
      {/* Completed stamp */}
      {completed && (
        <div className="absolute top-2 right-2 stamp-effect font-typewriter text-base animate-stamp-slam">
          Case Closed
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono-case text-noir-ink/40 text-[10px] tracking-widest">
            CASE #{String(caseData.id).padStart(3, "0")} · {caseData.difficulty.toUpperCase()}
          </p>
          <h2 className="font-typewriter text-3xl text-noir-ink mt-1 leading-tight">
            {caseData.title}
          </h2>
          <p className="font-mono-case text-xs text-noir-ink/50 italic mt-0.5">{caseData.subtitle}</p>
        </div>
        <div className={`font-typewriter text-[10px] border px-2 py-0.5 tracking-widest shrink-0 mt-1 ${diff.color}`}>
          {diff.text}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-noir-ink/12" />

      {/* Synopsis */}
      <div>
        <p className="font-typewriter text-[9px] text-noir-ink/40 tracking-[0.3em] uppercase mb-1.5">Synopsis</p>
        <p className="font-mono-case text-noir-ink/80 text-xs leading-relaxed">{caseData.teaser}</p>
      </div>

      {/* Briefing excerpt */}
      <div>
        <p className="font-typewriter text-[9px] text-noir-ink/40 tracking-[0.3em] uppercase mb-1.5">Field Briefing</p>
        <p className="font-mono-case text-noir-ink/65 text-xs leading-relaxed line-clamp-3">{caseData.briefing}</p>
      </div>

      {/* Objectives */}
      <div>
        <p className="font-typewriter text-[9px] text-noir-ink/40 tracking-[0.3em] uppercase mb-2">Investigation Stages</p>
        <div className="space-y-1.5">
          {caseData.objectives.map((obj, i) => (
            <div key={obj.id} className="flex items-start gap-2">
              <div className="mt-0.5 shrink-0 text-noir-ink/30">
                {completed || (i === 0)
                  ? <CheckCircle className="w-3 h-3 text-emerald-600/70" />
                  : <div className="w-3 h-3 rounded-full border border-noir-ink/25 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-noir-ink/25" />
                    </div>
                }
              </div>
              <span className="font-mono-case text-[10px] text-noir-ink/65 leading-tight">{obj.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Open button */}
      <div className="mt-auto pt-4">
        <button
          onClick={onOpen}
          className="flex items-center gap-2 font-typewriter text-sm tracking-wider text-noir-ink/60 hover:text-noir-ink transition-colors border-b border-dashed border-noir-ink/30 hover:border-noir-ink pb-0.5 group"
        >
          {completed ? "Review Case" : "Open Investigation"}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
