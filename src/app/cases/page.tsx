"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, CheckCircle, ArrowLeft } from "lucide-react";
import { CASES } from "@/data/cases";
import { useGameProgress } from "@/hooks/useGameProgress";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

const difficultyColors: Record<string, string> = {
  Rookie: "bg-noir-green/20 text-noir-green border-noir-green/30",
  Detective: "bg-primary/20 text-primary border-primary/30",
  "Senior Detective": "bg-noir-amber/20 text-noir-amber border-noir-amber/30",
  "Chief Inspector": "bg-noir-red/20 text-noir-red border-noir-red/30",
};

export default function CasesPage() {
  const { isCaseUnlocked, isCaseCompleted } = useGameProgress();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen noir-gradient relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 pt-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-typewriter text-3xl md:text-4xl text-primary tracking-wider">
            Case Board
          </h1>
        </div>
        <p className="font-mono-case text-muted-foreground mb-12 ml-9 italic text-sm">
          Active investigations — Precinct 47
        </p>

        {/* Connecting lines (decorative) */}
        <div className="relative">
          {/* Vertical string line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-primary/15" />

          <div className="grid md:grid-cols-2 gap-8">
            {CASES.map((c, i) => {
              const unlocked = mounted ? isCaseUnlocked(c.id) : c.id === 1;
              const completed = mounted ? isCaseCompleted(c.id) : false;

              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="relative"
                >
                  {/* Pin */}
                  <div className="hidden md:block evidence-pin absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0" />

                  {unlocked ? (
                    <Link href={`/case/${c.slug}`}>
                      <div className="case-file rounded p-6 hover:shadow-lg transition-shadow relative overflow-hidden group cursor-pointer">
                        {/* Completed stamp */}
                        {completed && (
                          <div className="absolute top-4 right-4 stamp-effect text-xs font-typewriter animate-stamp-slam">
                            Case Closed
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-3">
                          <span className="font-mono-case text-xs text-noir-ink/50">
                            Case #{String(c.id).padStart(3, "0")}
                          </span>
                          <Badge className={`text-[10px] font-typewriter border ${difficultyColors[c.difficulty]}`}>
                            {c.difficulty}
                          </Badge>
                        </div>

                        <h2 className="font-typewriter text-xl text-noir-ink mb-1 group-hover:text-noir-amber/80 transition-colors">
                          {c.title}
                        </h2>
                        <p className="font-mono-case text-xs text-noir-ink/50 mb-3 italic">
                          {c.subtitle}
                        </p>
                        <p className="text-sm text-noir-ink/70 leading-relaxed">
                          {c.teaser}
                        </p>

                        {completed && (
                          <div className="mt-4 flex items-center gap-1.5 text-noir-green font-mono-case text-xs">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Solved
                          </div>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <div className="case-file rounded p-6 opacity-60 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center bg-noir-paper/50 z-10">
                        <div className="flex flex-col items-center gap-2">
                          <Lock className="w-8 h-8 text-noir-ink/30" />
                          <span className="font-typewriter text-xs text-noir-ink/40 tracking-wider">
                            CLASSIFIED
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start justify-between mb-3">
                        <span className="font-mono-case text-xs text-noir-ink/50">
                          Case #{String(c.id).padStart(3, "0")}
                        </span>
                        <Badge className={`text-[10px] font-typewriter border ${difficultyColors[c.difficulty]}`}>
                          {c.difficulty}
                        </Badge>
                      </div>
                      <h2 className="font-typewriter text-xl text-noir-ink mb-1">{c.title}</h2>
                      <p className="font-mono-case text-xs text-noir-ink/50 italic">{c.subtitle}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
