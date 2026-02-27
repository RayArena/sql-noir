"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useGameProgress } from "@/hooks/useGameProgress";
import { CASES } from "@/data/cases";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  Shield,
  Trophy,
  Target,
  RotateCcw,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const rankThresholds = [
  { min: 0, title: "Rookie", icon: "🔰" },
  { min: 1, title: "Detective", icon: "🔍" },
  { min: 2, title: "Senior Detective", icon: "⭐" },
  { min: 3, title: "Chief Inspector", icon: "🏆" },
  { min: 4, title: "Legend of the Precinct", icon: "👑" },
];

function getRank(solvedCount: number) {
  return [...rankThresholds].reverse().find((r) => solvedCount >= r.min) ?? rankThresholds[0];
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { isCaseCompleted, getCurrentObjective, resetProgress, isLoading: progressLoading } = useGameProgress();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isLoaded || progressLoading) {
    return (
      <div className="min-h-screen noir-gradient flex items-center justify-center">
        <div className="font-typewriter text-primary/60 tracking-widest animate-pulse">
          Loading dossier...
        </div>
      </div>
    );
  }

  if (!user) return null;

  const solvedCases = CASES.filter((c) => isCaseCompleted(c.id));
  const totalCases = CASES.length;
  const rank = getRank(solvedCases.length);
  const completionPct = Math.round((solvedCases.length / totalCases) * 100);

  // Calculate total objectives completed
  const totalObjectives = CASES.reduce((sum, c) => sum + c.objectives.length, 0);
  const completedObjectives = CASES.reduce((sum, c) => {
    if (isCaseCompleted(c.id)) return sum + c.objectives.length;
    return sum + getCurrentObjective(c.id);
  }, 0);

  return (
    <div className="min-h-screen noir-gradient relative">
      {/* Noise overlay */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 pt-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/cases"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-typewriter text-3xl text-primary tracking-wider">
            Detective Dossier
          </h1>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-border bg-card/60 backdrop-blur-sm p-6 mb-8"
        >
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 border-2 border-primary/50 overflow-hidden shrink-0 bg-secondary">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName ?? "Detective"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary/50" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="font-typewriter text-2xl text-foreground tracking-wide truncate">
                {user.fullName ||
                  user.username ||
                  user.primaryEmailAddress?.emailAddress?.split("@")[0] ||
                  "Detective"}
              </h2>
              <p className="font-mono-case text-sm text-muted-foreground mt-0.5 truncate">
                {user.primaryEmailAddress?.emailAddress}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge className="font-typewriter text-xs border border-primary/30 bg-primary/10 text-primary tracking-wider">
                  {rank.icon} {rank.title}
                </Badge>
                <span className="font-mono-case text-xs text-muted-foreground">
                  Badge #{String(user.id).slice(-6).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="border border-border bg-card/40 p-4 text-center">
            <Trophy className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="font-typewriter text-2xl text-foreground">
              {solvedCases.length}
            </div>
            <div className="font-mono-case text-[10px] text-muted-foreground tracking-wider uppercase mt-1">
              Cases Solved
            </div>
          </div>
          <div className="border border-border bg-card/40 p-4 text-center">
            <Target className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="font-typewriter text-2xl text-foreground">
              {completedObjectives}/{totalObjectives}
            </div>
            <div className="font-mono-case text-[10px] text-muted-foreground tracking-wider uppercase mt-1">
              Objectives
            </div>
          </div>
          <div className="border border-border bg-card/40 p-4 text-center">
            <Shield className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="font-typewriter text-2xl text-foreground">
              {completionPct}%
            </div>
            <div className="font-mono-case text-[10px] text-muted-foreground tracking-wider uppercase mt-1">
              Completion
            </div>
          </div>
        </motion.div>

        {/* Case Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-border bg-card/40 p-5 mb-8"
        >
          <h3 className="font-typewriter text-sm text-primary tracking-widest uppercase mb-4">
            Case Record
          </h3>
          <div className="space-y-3">
            {CASES.map((c) => {
              const completed = isCaseCompleted(c.id);
              const objIdx = getCurrentObjective(c.id);
              const progress = completed
                ? c.objectives.length
                : objIdx;

              return (
                <div
                  key={c.id}
                  className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0"
                >
                  <span className="font-mono-case text-xs text-muted-foreground w-16 shrink-0">
                    #{String(c.id).padStart(3, "0")}
                  </span>
                  <span className="font-typewriter text-sm text-foreground flex-1 truncate">
                    {c.title}
                  </span>

                  {/* Progress bar */}
                  <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden shrink-0">
                    <div
                      className={`h-full transition-all duration-500 ${
                        completed ? "bg-noir-green" : progress > 0 ? "bg-primary" : "bg-transparent"
                      }`}
                      style={{
                        width: `${(progress / c.objectives.length) * 100}%`,
                      }}
                    />
                  </div>

                  <span className="font-mono-case text-[10px] text-muted-foreground w-10 text-right shrink-0">
                    {progress}/{c.objectives.length}
                  </span>

                  {completed && (
                    <CheckCircle className="w-4 h-4 text-noir-green shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {/* Reset progress */}
          {!showResetConfirm ? (
            <Button
              variant="outline"
              onClick={() => setShowResetConfirm(true)}
              className="font-typewriter text-xs tracking-widest uppercase border-destructive/40 text-destructive hover:bg-destructive/10 gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Progress
            </Button>
          ) : (
            <div className="flex items-center gap-2 border border-destructive/30 bg-destructive/5 px-4 py-2">
              <span className="font-mono-case text-xs text-destructive">
                Erase all progress?
              </span>
              <Button
                size="sm"
                variant="destructive"
                onClick={async () => {
                  await resetProgress();
                  setShowResetConfirm(false);
                }}
                className="font-typewriter text-xs tracking-wider h-7 px-3"
              >
                Confirm
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowResetConfirm(false)}
                className="font-typewriter text-xs tracking-wider h-7 px-3"
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Sign out */}
          <Button
            variant="outline"
            onClick={() => signOut({ redirectUrl: "/" })}
            className="font-typewriter text-xs tracking-widest uppercase border-border text-muted-foreground hover:text-foreground gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </Button>
        </motion.div>

        {/* Joined date */}
        <div className="mt-8 text-center">
          <p className="font-mono-case text-[10px] text-muted-foreground/40">
            Joined the force:{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Unknown"}
          </p>
        </div>
      </div>
    </div>
  );
}
