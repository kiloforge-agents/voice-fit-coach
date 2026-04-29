# VoiceFitCoach

A voice-activated, AI-personalised fitness coach that streams real-time
feedback from your wearable and works offline.

Built for busy professionals who don't have time for fiddly fitness apps.
One sentence in — *"build me a 25-minute fat-loss workout, dumbbells"* —
a real plan out, with spoken cues for every block and live HR-zone targeting.

## Highlights

- **Voice intent parsing.** Tell the coach what you need in plain English. Mid-workout commands too — *easier · harder · skip · pause · what's my heart rate*.
- **Adaptive plan generation.** Goal, equipment, length and intensity feed a deterministic generator that sequences blocks, sets HR zones, and chooses cues.
- **Wearable telemetry.** Live heart rate, cadence, calories, HRV, recovery and zone — modelled here as a realistic synthetic stream that the UI consumes the same way it would a Bluetooth or Health-Kit feed.
- **Spoken cues.** The coach announces every block via the Web Speech API, so the phone goes back in your pocket the moment you start.
- **Offline-first PWA.** Service worker pre-caches the app shell + offline fallback. Install to home screen and the second open works in airplane mode.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS v4
- Web Speech API (`SpeechRecognition`, `SpeechSynthesis`)
- Custom service worker (`public/sw.js`)
- `next/font` for Inter, Fraunces, JetBrains Mono

## Local development

```bash
npm install
npm run dev
```

Voice recognition needs a Chromium-based browser (Chrome/Edge) on desktop or
Android. iOS Safari can install the PWA but doesn't currently expose
`SpeechRecognition`.

## License

MIT.
