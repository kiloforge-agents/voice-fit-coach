// Lightweight intent parser + Web Speech API hook helpers.
// The parser is intentionally tiny but forgiving — designed for verbal,
// imperfect speech-to-text input.

import type { Goal, Equipment, Profile } from "./workouts";

export type Intent =
  | { kind: "start"; profile: Partial<Profile> }
  | { kind: "pause" }
  | { kind: "resume" }
  | { kind: "skip" }
  | { kind: "stop" }
  | { kind: "next" }
  | { kind: "repeat" }
  | { kind: "set_intensity"; intensity: 1 | 2 | 3 | 4 | 5 }
  | { kind: "set_minutes"; minutes: number }
  | { kind: "set_goal"; goal: Goal }
  | { kind: "set_equipment"; equipment: Equipment }
  | { kind: "metric"; metric: "heart" | "calories" | "steps" | "time" }
  | { kind: "help" }
  | { kind: "unknown"; raw: string };

const NUMBERS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, fifteen: 15, twenty: 20,
  twentyfive: 25, thirty: 30, fortyfive: 45, sixty: 60,
};

function parseNumber(text: string): number | null {
  const m = text.match(/(\d{1,3})/);
  if (m) return parseInt(m[1], 10);
  for (const word of Object.keys(NUMBERS)) {
    if (new RegExp(`\\b${word}\\b`).test(text)) return NUMBERS[word];
  }
  return null;
}

export function parseIntent(input: string): Intent {
  const text = input.trim().toLowerCase();
  if (!text) return { kind: "unknown", raw: input };

  if (/\b(help|what can you do|commands)\b/.test(text)) return { kind: "help" };
  if (/\b(pause|hold on|wait)\b/.test(text)) return { kind: "pause" };
  if (/\b(resume|continue|keep going)\b/.test(text)) return { kind: "resume" };
  if (/\b(stop|end workout|i'?m done|cancel)\b/.test(text)) return { kind: "stop" };
  if (/\b(skip|next move|move on|forward)\b/.test(text)) return { kind: "next" };
  if (/\b(repeat|again|one more)\b/.test(text)) return { kind: "repeat" };

  if (/\bheart rate|how's my heart|bpm|pulse\b/.test(text)) return { kind: "metric", metric: "heart" };
  if (/\bcalories|burn(ed|ing)?\b/.test(text)) return { kind: "metric", metric: "calories" };
  if (/\b(steps|step count)\b/.test(text)) return { kind: "metric", metric: "steps" };
  if (/\b(time left|how long|remaining|how much longer)\b/.test(text)) return { kind: "metric", metric: "time" };

  // Intensity phrases
  if (/\b(easier|easy|chill|gentle|slow it down)\b/.test(text)) return { kind: "set_intensity", intensity: 2 };
  if (/\b(harder|push|crush|amp|all.?out|max|brutal)\b/.test(text)) return { kind: "set_intensity", intensity: 5 };
  const iMatch = text.match(/\bintensity\s+(?:to\s+)?(one|two|three|four|five|\d)\b/);
  if (iMatch) {
    const n = parseNumber(iMatch[1]);
    if (n && n >= 1 && n <= 5) return { kind: "set_intensity", intensity: n as 1 | 2 | 3 | 4 | 5 };
  }

  // Goals
  if (/\b(strength|lift|stronger)\b/.test(text)) return { kind: "set_goal", goal: "strength" };
  if (/\b(endurance|cardio|run|conditioning|stamina)\b/.test(text)) return { kind: "set_goal", goal: "endurance" };
  if (/\b(fat loss|burn|cut|lose weight|sweat|hiit)\b/.test(text)) return { kind: "set_goal", goal: "fat-loss" };
  if (/\b(mobility|stretch|recovery|loosen|stiff)\b/.test(text)) return { kind: "set_goal", goal: "mobility" };
  if (/\b(calm|relax|breathe|wind down|destress|reset)\b/.test(text)) return { kind: "set_goal", goal: "calm" };

  // Equipment
  if (/\bdumbbell|d\.?b\.?\b/.test(text)) return { kind: "set_equipment", equipment: "dumbbells" };
  if (/\bkettlebell|k\.?b\.?\b/.test(text)) return { kind: "set_equipment", equipment: "kettlebell" };
  if (/\bband|resistance band\b/.test(text)) return { kind: "set_equipment", equipment: "bands" };
  if (/\bgym|barbell|rack\b/.test(text)) return { kind: "set_equipment", equipment: "full-gym" };
  if (/\b(no equipment|bodyweight|nothing)\b/.test(text)) return { kind: "set_equipment", equipment: "none" };

  // Time-only commands "make it 20 minutes"
  if (/\bminute|min\b/.test(text)) {
    const n = parseNumber(text);
    if (n && n >= 5 && n <= 90) return { kind: "set_minutes", minutes: n };
  }

  // Start commands — extract any present params
  if (/\b(start|begin|let's go|coach me|workout|train me|build me)\b/.test(text)) {
    const profile: Partial<Profile> = {};
    const min = parseNumber(text);
    if (min && /\bminute|min\b/.test(text) && min >= 5 && min <= 90) profile.minutes = min;
    if (/\bstrength|stronger|lift\b/.test(text)) profile.goal = "strength";
    else if (/\bendurance|cardio|stamina\b/.test(text)) profile.goal = "endurance";
    else if (/\bfat|burn|hiit|sweat\b/.test(text)) profile.goal = "fat-loss";
    else if (/\bmobility|stretch|recovery\b/.test(text)) profile.goal = "mobility";
    else if (/\bcalm|breathe|reset\b/.test(text)) profile.goal = "calm";

    if (/\bdumbbell\b/.test(text)) profile.equipment = "dumbbells";
    else if (/\bkettlebell\b/.test(text)) profile.equipment = "kettlebell";
    else if (/\bband\b/.test(text)) profile.equipment = "bands";
    else if (/\b(no equipment|bodyweight)\b/.test(text)) profile.equipment = "none";
    else if (/\bgym\b/.test(text)) profile.equipment = "full-gym";

    return { kind: "start", profile };
  }

  return { kind: "unknown", raw: input };
}

// ---- speech synthesis helpers ----

export function speak(text: string, opts: { rate?: number; pitch?: number } = {}) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = opts.rate ?? 1.02;
    u.pitch = opts.pitch ?? 1;
    // Choose the most natural English voice we can find.
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => /Samantha|Google US English|Karen|Daniel|Serena/i.test(v.name)) ||
      voices.find((v) => v.lang.startsWith("en"));
    if (preferred) u.voice = preferred;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    /* no-op */
  }
}

export function isSpeechRecognitionAvailable(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    // @ts-expect-error - vendor types
    window.SpeechRecognition || window.webkitSpeechRecognition
  );
}

export interface SpeechRecognizer {
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export function createRecognizer(opts: {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (err: string) => void;
  onEnd?: () => void;
}): SpeechRecognizer | null {
  if (typeof window === "undefined") return null;
  // @ts-expect-error - vendor types
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = "en-US";

  rec.onresult = (event: {
    resultIndex: number;
    results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
  }) => {
    let interim = "";
    let final = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const r = event.results[i];
      if (r.isFinal) final += r[0].transcript;
      else interim += r[0].transcript;
    }
    if (final) opts.onResult(final.trim(), true);
    else if (interim) opts.onResult(interim.trim(), false);
  };

  rec.onerror = (e: { error?: string }) => opts.onError?.(e.error || "unknown");
  rec.onend = () => opts.onEnd?.();

  return {
    start: () => {
      try {
        rec.start();
      } catch {
        /* already running */
      }
    },
    stop: () => {
      try {
        rec.stop();
      } catch {
        /* */
      }
    },
    abort: () => {
      try {
        rec.abort();
      } catch {
        /* */
      }
    },
  };
}
