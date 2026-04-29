// Realistic synthetic wearable telemetry stream. In real life we'd subscribe
// to a Bluetooth device or platform health-kit; here we model the same shape
// (heart rate, cadence, calories, steps) so the UI looks and behaves the same.

export interface Telemetry {
  heartRate: number;        // bpm
  cadence: number;          // steps/min
  calories: number;         // running total kcal
  steps: number;            // running total
  zone: 1 | 2 | 3 | 4 | 5;  // current HR zone
  hrv: number;              // ms
  recoveryScore: number;    // 0..100
  device: string;
  battery: number;          // 0..100
  signal: "strong" | "ok" | "weak";
  timestamp: number;
}

export type State = "idle" | "warmup" | "work" | "rest" | "cooldown";

const DEVICE_NAMES = ["Garmin Fenix", "Apple Watch", "WHOOP 4.0", "Oura Ring", "Polar H10"];

export function pickDevice(seed = 0): string {
  return DEVICE_NAMES[seed % DEVICE_NAMES.length];
}

export interface SimulatorOpts {
  baseHr?: number;       // resting target
  state: State;
  zoneTarget: 1 | 2 | 3 | 4 | 5;
  intensity: 1 | 2 | 3 | 4 | 5;
}

const ZONE_BPM: Record<number, [number, number]> = {
  1: [80, 110],
  2: [110, 132],
  3: [132, 152],
  4: [152, 170],
  5: [170, 188],
};

export function nextTelemetry(prev: Telemetry, opts: SimulatorOpts): Telemetry {
  const target =
    opts.state === "rest"
      ? Math.max(95, ZONE_BPM[Math.max(1, opts.zoneTarget - 1)][0])
      : opts.state === "warmup"
      ? ZONE_BPM[2][0]
      : opts.state === "cooldown"
      ? ZONE_BPM[1][1]
      : (ZONE_BPM[opts.zoneTarget][0] + ZONE_BPM[opts.zoneTarget][1]) / 2;

  // Drift toward target with noise
  const drift = (target - prev.heartRate) * 0.08;
  const noise = (Math.random() - 0.5) * 3.2;
  const heartRate = Math.max(58, Math.min(198, Math.round(prev.heartRate + drift + noise)));

  // Determine actual zone
  let zone: 1 | 2 | 3 | 4 | 5 = 1;
  for (const z of [1, 2, 3, 4, 5] as const) {
    const [lo, hi] = ZONE_BPM[z];
    if (heartRate >= lo && heartRate < hi + 1) zone = z;
  }
  if (heartRate >= ZONE_BPM[5][0]) zone = 5;

  // Cadence — only meaningful when working
  const cadence =
    opts.state === "work"
      ? Math.round(110 + opts.intensity * 12 + (Math.random() - 0.5) * 18)
      : opts.state === "warmup"
      ? Math.round(70 + Math.random() * 12)
      : Math.round(Math.max(0, prev.cadence * 0.6));

  // Calories (~ kcal/sec, scaled by HR)
  const kcalPerSecond = (heartRate / 1000) * 1.6;
  const calories = +(prev.calories + kcalPerSecond).toFixed(1);

  // Steps proxy
  const steps = prev.steps + Math.round((cadence / 60) * 1);

  // HRV jitters slowly
  const hrv = Math.max(28, Math.min(120, prev.hrv + (Math.random() - 0.5) * 0.6));

  // Recovery score barely moves during a session
  const recoveryScore = Math.max(35, Math.min(100, prev.recoveryScore - 0.005));

  return {
    heartRate,
    cadence,
    calories,
    steps,
    zone,
    hrv: +hrv.toFixed(1),
    recoveryScore: +recoveryScore.toFixed(0),
    device: prev.device,
    battery: Math.max(0, prev.battery - 0.0008),
    signal: prev.signal,
    timestamp: Date.now(),
  };
}

export function startTelemetry(seed = 0): Telemetry {
  return {
    heartRate: 72 + Math.round(Math.random() * 6),
    cadence: 0,
    calories: 0,
    steps: 0,
    zone: 1,
    hrv: 62 + Math.round(Math.random() * 18),
    recoveryScore: 78 + Math.round(Math.random() * 12),
    device: pickDevice(seed),
    battery: 92 - Math.round(Math.random() * 8),
    signal: "strong",
    timestamp: Date.now(),
  };
}
