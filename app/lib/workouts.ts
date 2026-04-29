// Local AI-style workout generator. No external API required — the rules below
// drive the personalisation. The "personality" comes from how parameters
// combine, mirroring how a human coach would adapt a session on the fly.

export type Goal =
  | "strength"
  | "endurance"
  | "fat-loss"
  | "mobility"
  | "calm";

export type Equipment = "none" | "dumbbells" | "kettlebell" | "bands" | "full-gym";

export interface Profile {
  name?: string;
  minutes: number;
  goal: Goal;
  intensity: 1 | 2 | 3 | 4 | 5;
  equipment: Equipment;
  hr_max?: number;
}

export interface Block {
  id: string;
  title: string;
  movement: string;
  duration: number;
  rest: number;
  cues: string[];
  zone: 1 | 2 | 3 | 4 | 5;
  reps?: string;
}

export interface Plan {
  id: string;
  title: string;
  subtitle: string;
  totalSeconds: number;
  blocks: Block[];
  generatedAt: number;
  profile: Profile;
}

const MOVEMENTS: Record<Goal, Record<Equipment, string[]>> = {
  strength: {
    none: ["Pike push-ups", "Bulgarian split squat (bodyweight)", "Diamond push-ups", "Single-leg glute bridge"],
    dumbbells: ["Goblet squat", "Renegade row", "DB Romanian deadlift", "DB push press"],
    kettlebell: ["KB clean & press", "Goblet squat", "KB swing — heavy", "Turkish get-up"],
    bands: ["Banded squat", "Banded row", "Banded press", "Pallof press"],
    "full-gym": ["Back squat", "Bench press", "Romanian deadlift", "Weighted pull-up"],
  },
  endurance: {
    none: ["Air squats", "Mountain climbers", "Jump lunges", "Burpees"],
    dumbbells: ["DB thrusters", "DB step-ups", "Renegade rows", "Farmer's carry"],
    kettlebell: ["KB swings — light", "KB snatch", "Goblet reverse lunge", "KB carry"],
    bands: ["Banded sprints in place", "Banded jumping jacks", "Banded high knees", "Banded skater"],
    "full-gym": ["Rower intervals", "Assault bike sprints", "Box jumps", "Wall balls"],
  },
  "fat-loss": {
    none: ["Burpees", "High knees", "Squat jumps", "Plank shoulder taps"],
    dumbbells: ["DB squat → press", "DB swings", "Renegade rows", "DB lunges"],
    kettlebell: ["KB swings", "Goblet squat", "KB snatch", "KB clean"],
    bands: ["Banded squat-pulls", "Banded skater hops", "Banded mountain climbers", "Banded cross-body chops"],
    "full-gym": ["Rower 250m repeats", "Sled push", "Battle ropes", "Bike sprints"],
  },
  mobility: {
    none: ["World's greatest stretch", "90/90 hip switch", "Cat-cow flow", "Down-dog → cobra"],
    dumbbells: ["Light DB halos", "DB windmill", "DB Cossack squat", "DB pullover"],
    kettlebell: ["KB windmill", "KB armbar", "Goblet squat hold", "KB halos"],
    bands: ["Banded shoulder dislocates", "Banded hip openers", "Banded ankle drives", "Banded thoracic openers"],
    "full-gym": ["Foam roller flow", "Couch stretch", "Hip CARs", "Shoulder CARs"],
  },
  calm: {
    none: ["Box breathing 4-4-4-4", "Slow forward fold", "Legs up the wall", "Supine twist"],
    dumbbells: ["Light DB pullover (slow tempo)", "Goblet squat hold", "DB Romanian deadlift (slow)", "DB curls (tempo)"],
    kettlebell: ["KB halos (slow)", "KB armbar", "KB suitcase carry", "Goblet hold"],
    bands: ["Banded breathing draws", "Banded chest opener hold", "Banded hip mobility flow", "Banded thoracic opener"],
    "full-gym": ["Easy bike spin", "Foam roller flow", "Treadmill walk @ incline", "Stretching circuit"],
  },
};

const CUES: Record<Goal, string[]> = {
  strength: [
    "Brace before every rep, breathe out at the top.",
    "Slow down the lowering phase — three count.",
    "Drive through the heels, ribcage stacked over hips.",
    "Match effort to RPE 8 — two reps in reserve.",
  ],
  endurance: [
    "Nasal breathing while you can — switch to mouth on the hard intervals.",
    "Find a rhythm you could sustain for 20 minutes, then add 5%.",
    "Eyes up. Drive the elbows back, not the chin forward.",
    "Reset your breath cadence at every transition.",
  ],
  "fat-loss": [
    "Keep the rests short — under 25 seconds.",
    "If your form breaks, reduce range before you reduce reps.",
    "Sip water between blocks, not during.",
    "Stay tall — collapsed posture wastes oxygen.",
  ],
  mobility: [
    "Move slowly — let the breath lead the movement.",
    "End-range, not pain-range. Back off 10%.",
    "Five long exhales per stretch.",
    "Stack the joints — neutral spine first, then move.",
  ],
  calm: [
    "Inhale four, hold four, exhale four, hold four.",
    "Notice the floor under you. Let weight drop.",
    "Soften the jaw and the eyes.",
    "If a thought arrives, label it 'thinking' and return to the breath.",
  ],
};

const ZONES_BY_INTENSITY: Record<number, (1 | 2 | 3 | 4 | 5)[]> = {
  1: [1, 2, 1, 2],
  2: [2, 2, 3, 2],
  3: [2, 3, 3, 4],
  4: [3, 4, 4, 5],
  5: [4, 5, 5, 4],
};

const TITLES: Record<Goal, string[]> = {
  strength: ["Quiet strength", "Iron clock", "Ground & press"],
  endurance: ["Long road", "Rolling tempo", "Steady fire"],
  "fat-loss": ["Heat circuit", "Sweat protocol", "Furnace flow"],
  mobility: ["Open hour", "Slow unwind", "Joint reset"],
  calm: ["Still water", "Off-the-clock", "Decompress"],
};

function rand<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

function pickN<T>(arr: T[], n: number, seed: number): T[] {
  const out: T[] = [];
  const used = new Set<number>();
  for (let i = 0; i < n; i++) {
    let idx = Math.abs(seed + i * 31) % arr.length;
    let guard = 0;
    while (used.has(idx) && guard < arr.length) {
      idx = (idx + 1) % arr.length;
      guard++;
    }
    used.add(idx);
    out.push(arr[idx]);
  }
  return out;
}

export function generatePlan(profile: Profile): Plan {
  const seed = Math.floor(profile.minutes * 7 + profile.intensity * 13 + profile.goal.length * 5);
  const moves = MOVEMENTS[profile.goal][profile.equipment];
  const cuePool = CUES[profile.goal];
  const zones = ZONES_BY_INTENSITY[profile.intensity];

  const work = Math.round(28 + profile.intensity * 6);
  const rest = Math.round(36 - profile.intensity * 4);
  const blockSeconds = work + rest;
  const budget = profile.minutes * 60;
  const mainCount = Math.max(3, Math.min(8, Math.floor((budget - 150) / blockSeconds)));

  const picks = pickN(moves, mainCount, seed);
  const cuePicks = pickN(cuePool, mainCount, seed + 5);

  const blocks: Block[] = [];

  blocks.push({
    id: "warmup",
    title: "Warm-up",
    movement: "Joint primer flow",
    duration: 90,
    rest: 0,
    zone: 2,
    cues: ["Get the joints moving — circles at the ankles, hips, shoulders.", "Two long exhales between movements."],
  });

  picks.forEach((move, i) => {
    const z = zones[i % zones.length];
    blocks.push({
      id: `b-${i}`,
      title: `Block ${i + 1}`,
      movement: move,
      duration: work,
      rest,
      zone: z,
      reps: profile.goal === "strength" ? "6–8 reps" : profile.goal === "mobility" || profile.goal === "calm" ? "slow tempo" : "AMRAP",
      cues: [cuePicks[i]],
    });
  });

  blocks.push({
    id: "winddown",
    title: "Wind-down",
    movement: profile.goal === "calm" ? "5-minute breath ladder" : "Long exhale stretches",
    duration: 60,
    rest: 0,
    zone: 1,
    cues: ["Box breathing 4-4-4-4.", "Lower the lights mentally — easy in, easy out."],
  });

  const totalSeconds = blocks.reduce((s, b) => s + b.duration + b.rest, 0);

  return {
    id: `plan-${Date.now()}`,
    title: rand(TITLES[profile.goal], seed),
    subtitle: subtitle(profile),
    totalSeconds,
    blocks,
    generatedAt: Date.now(),
    profile,
  };
}

function subtitle(p: Profile): string {
  const intensityWord =
    p.intensity <= 2 ? "easy-pace" : p.intensity === 3 ? "moderate" : p.intensity === 4 ? "spicy" : "all-out";
  const equip =
    p.equipment === "none"
      ? "bodyweight"
      : p.equipment === "full-gym"
      ? "full gym"
      : p.equipment;
  return `${p.minutes}-min · ${intensityWord} · ${equip} · ${p.goal.replace("-", " ")}`;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m}:00` : `${m}:${String(s).padStart(2, "0")}`;
}
