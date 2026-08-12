"use client";

import { useCallback, useRef, useEffect } from "react";
import type { CharacterName, VoiceProfile } from "@/data/storyScripts";
import { CHARACTER_VOICES } from "@/data/storyScripts";

export function useVoiceNarration() {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      synthRef.current?.cancel();
    };
  }, []);

  const speak = useCallback(
    (text: string, character: CharacterName, onEnd?: () => void): void => {
      const synth = synthRef.current;
      if (!synth) {
        onEnd?.();
        return;
      }

      synth.cancel();

      const profile: VoiceProfile = CHARACTER_VOICES[character] ?? { pitch: 1, rate: 1, volume: 1 };
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = profile.pitch;
      utterance.rate = profile.rate;
      utterance.volume = profile.volume;

      // Try to find a suitable voice
      const voices = synth.getVoices();
      if (voices.length > 0) {
        // Prefer en-GB for a noir/vintage feel
        const preferred = voices.find(
          (v) => v.lang === "en-GB" && !v.name.toLowerCase().includes("network")
        ) ?? voices.find((v) => v.lang.startsWith("en"));
        if (preferred) utterance.voice = preferred;
      }

      utterance.onstart = () => { isSpeakingRef.current = true; };
      utterance.onend = () => {
        isSpeakingRef.current = false;
        onEnd?.();
      };
      utterance.onerror = () => {
        isSpeakingRef.current = false;
        onEnd?.();
      };

      synth.speak(utterance);
    },
    []
  );

  const stop = useCallback(() => {
    synthRef.current?.cancel();
    isSpeakingRef.current = false;
  }, []);

  const isSpeaking = () => isSpeakingRef.current;

  return { speak, stop, isSpeaking };
}
