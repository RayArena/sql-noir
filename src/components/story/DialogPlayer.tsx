"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, ChevronRight, SkipForward } from "lucide-react";
import type { DialogLine } from "@/data/storyScripts";
import { CHARACTER_DISPLAY } from "@/data/storyScripts";
import { useVoiceNarration } from "@/hooks/useVoiceNarration";

interface DialogPlayerProps {
  lines: DialogLine[];
  onComplete: () => void;
  onSkip: () => void;
  title?: string;
}

export function DialogPlayer({ lines, onComplete, onSkip, title }: DialogPlayerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const { speak, stop } = useVoiceNarration();
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentLine = lines[currentIdx];
  const charInfo = currentLine ? CHARACTER_DISPLAY[currentLine.character] : null;
  const isLastLine = currentIdx >= lines.length - 1;

  const startLine = useCallback(
    (idx: number) => {
      if (idx >= lines.length) {
        onComplete();
        return;
      }
      const line = lines[idx];
      setDisplayedText("");
      setIsTyping(true);

      // Typewriter effect
      let charIdx = 0;
      const text = line.text;
      if (typingRef.current) clearInterval(typingRef.current);

      typingRef.current = setInterval(() => {
        charIdx++;
        setDisplayedText(text.slice(0, charIdx));
        if (charIdx >= text.length) {
          if (typingRef.current) clearInterval(typingRef.current);
          setIsTyping(false);
          // Auto-advance for lines with a pause
          if (line.pause && line.pause > 0) {
            setTimeout(() => advanceLine(), line.pause);
          }
        }
      }, 28); // ~35 chars/sec — fast enough to feel alive, slow enough to read

      // Voice narration
      if (voiceEnabled) {
        speak(text, line.character);
      }
    },
    [lines, onComplete, speak, voiceEnabled]
  );

  const advanceLine = useCallback(() => {
    stop();
    if (typingRef.current) {
      clearInterval(typingRef.current);
      typingRef.current = null;
    }
    // If currently typing — show all text immediately
    const line = lines[currentIdx];
    if (isTyping && line) {
      setDisplayedText(line.text);
      setIsTyping(false);
      return;
    }
    // Otherwise advance to next line
    const next = currentIdx + 1;
    setCurrentIdx(next);
    startLine(next);
  }, [currentIdx, isTyping, lines, startLine, stop]);

  useEffect(() => {
    setCurrentIdx(0);
    startLine(0);
    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        advanceLine();
      }
      if (e.key === "Escape") onSkip();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [advanceLine, onSkip]);

  if (!currentLine || !charInfo) return null;

  const emotionGlow: Record<string, string> = {
    shocked:    "shadow-[0_0_60px_hsl(0_80%_40%/0.3)]",
    excited:    "shadow-[0_0_60px_hsl(45_90%_50%/0.3)]",
    suspicious: "shadow-[0_0_60px_hsl(200_80%_40%/0.3)]",
    grave:      "shadow-[0_0_60px_hsl(270_60%_30%/0.2)]",
    smug:       "shadow-[0_0_60px_hsl(120_60%_30%/0.2)]",
    sad:        "shadow-[0_0_60px_hsl(220_60%_30%/0.2)]",
    neutral:    "",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "rgba(5,8,15,0.97)" }}
      onClick={advanceLine}
    >
      {/* Atmospheric scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)",
        }}
      />

      {/* Top bar — title + controls */}
      <div className="relative z-10 flex items-center justify-between px-6 py-3 border-b border-white/5">
        {title && (
          <span className="font-typewriter text-xs tracking-[0.3em] text-white/30 uppercase">{title}</span>
        )}
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); setVoiceEnabled((v) => !v); }}
            className="p-2 rounded text-white/30 hover:text-white/70 transition-colors"
            title={voiceEnabled ? "Mute voice" : "Enable voice"}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onSkip(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/10 text-white/30 hover:text-white/70 hover:border-white/30 transition-all font-typewriter text-xs tracking-wider"
          >
            <SkipForward className="w-3 h-3" />
            Skip
          </button>
        </div>
      </div>

      {/* Center — dialog area */}
      <div className="flex-1 flex flex-col items-center justify-end pb-16 px-6">
        {/* Progress dots */}
        <div className="flex gap-1.5 mb-8">
          {lines.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i < currentIdx
                  ? "w-2 h-2 bg-white/20"
                  : i === currentIdx
                  ? "w-4 h-2 bg-white/60"
                  : "w-2 h-2 bg-white/8"
              }`}
            />
          ))}
        </div>

        {/* Dialog box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className={`w-full max-w-3xl rounded-lg border border-white/10 overflow-hidden ${emotionGlow[currentLine.emotion ?? "neutral"]}`}
            style={{ background: "rgba(10,14,24,0.95)" }}
          >
            {/* Character nameplate */}
            <div
              className="px-6 pt-4 pb-2 border-b border-white/5"
              style={{ borderLeft: `3px solid ${charInfo.color}` }}
            >
              <span
                className="font-typewriter text-sm tracking-widest uppercase"
                style={{ color: charInfo.color }}
              >
                {charInfo.name}
              </span>
            </div>

            {/* Dialog text */}
            <div className="px-6 py-5 min-h-[100px]">
              <p className="font-mono-case text-[15px] text-white/90 leading-relaxed">
                {displayedText}
                {isTyping && (
                  <span className="inline-block w-0.5 h-4 bg-white/50 ml-0.5 animate-pulse align-middle" />
                )}
              </p>
            </div>

            {/* Click to continue indicator */}
            {!isTyping && (
              <div className="px-6 pb-4 flex items-center justify-end gap-1.5">
                <span className="font-typewriter text-[10px] tracking-widest text-white/25 uppercase">
                  {isLastLine ? "Continue" : "Click to continue"}
                </span>
                <ChevronRight className="w-3 h-3 text-white/25 animate-pulse" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Vignette bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(5,8,15,0.6), transparent)" }} />
    </div>
  );
}
