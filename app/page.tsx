import CoachConsole from "./components/CoachConsole";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative z-10 flex flex-col">
      <SiteHeader />
      <Hero />
      <Marquee />
      <main className="mx-auto max-w-7xl w-full px-5 sm:px-8 pb-24">
        <CoachConsole />
        <Pillars />
        <Workflow />
        <FieldNotes />
        <CallToAction />
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="mx-auto max-w-7xl w-full px-5 sm:px-8 py-5 flex items-center justify-between relative z-10">
      <Link href="/" className="flex items-center gap-2.5 group">
        <span className="grid place-items-center size-8 rounded-md bg-ink text-bg group-hover:rotate-[-4deg] transition-transform">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12h3l3-7 4 14 3-7h7" />
          </svg>
        </span>
        <span className="font-display text-xl tracking-tight">VoiceFitCoach</span>
      </Link>
      <nav className="hidden md:flex items-center gap-7 text-sm">
        <a href="#coach" className="hover:underline underline-offset-4">Coach</a>
        <a href="#pillars" className="hover:underline underline-offset-4">Why it works</a>
        <a href="#workflow" className="hover:underline underline-offset-4">A typical session</a>
        <a href="#cta" className="hover:underline underline-offset-4">Get the PWA</a>
      </nav>
      <a href="#coach" className="btn btn-primary text-sm py-2.5 px-4">
        Talk to the coach
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-7xl w-full px-5 sm:px-8 pt-10 pb-12 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-6">
            <span className="size-1.5 rounded-full bg-coral inline-block mr-2 align-middle" />
            Voice-first · wearable-aware · works offline
          </p>
          <h1 className="h-display text-[58px] sm:text-[88px] lg:text-[118px]">
            Hands-free{" "}
            <em className="font-display italic" style={{ fontVariationSettings: "'SOFT' 100" }}>
              workouts
            </em>
            ,
            <br />
            built around{" "}
            <span className="relative inline-block">
              <span className="relative z-10">your day.</span>
              <span className="absolute inset-x-1 -bottom-1 h-3 bg-lime -z-0 -skew-y-1" />
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg sm:text-xl text-ink-soft leading-relaxed">
            VoiceFitCoach turns a sentence into a session. Tell it &ldquo;build me a 25-minute strength
            workout, dumbbells&rdquo; — it cues every block, listens for follow-up commands, and reads
            your wearable in real time so the next set fits how you actually feel. No screen
            fiddling, no menus, no friction. Even at 30,000ft.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#coach" className="btn btn-primary">
              Try it now &nbsp;•&nbsp; <span className="font-mono text-[12px] opacity-70">no signup</span>
            </a>
            <a href="#workflow" className="btn btn-ghost">
              See a typical session
            </a>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted ml-2">
              v1.0 · open beta
            </span>
          </div>
        </div>

        <div className="lg:col-span-4">
          <HeroCallout />
        </div>
      </div>
    </section>
  );
}

function HeroCallout() {
  return (
    <aside className="card p-6 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 size-40 rounded-full bg-lime/40 blur-2xl drift" />
      <div className="relative z-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Built for</p>
        <h2 className="font-display text-3xl mt-2 leading-tight">
          People with <em className="font-display italic">eight minutes</em> between meetings.
        </h2>
        <ul className="mt-5 space-y-3 text-[15px]">
          <Bullet>One sentence in. A real plan out.</Bullet>
          <Bullet>The screen stays in your pocket once you start.</Bullet>
          <Bullet>Adapts to your heart rate every second.</Bullet>
          <Bullet>Works on the train. Works on the plane.</Bullet>
        </ul>
      </div>
    </aside>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 items-start">
      <span className="mt-1.5 size-1.5 rounded-full bg-coral shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function Marquee() {
  const items = [
    "Voice intent parsing",
    "Adaptive HR-zone targeting",
    "BLE wearable sync",
    "Service-worker offline cache",
    "Spoken cues every block",
    "5–60 minute sessions",
    "Strength · Endurance · Mobility · Calm",
    "No tap workouts",
  ];
  return (
    <div className="border-y border-rule bg-paper/60 overflow-hidden">
      <div className="ticker-track flex gap-12 py-3 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        {[...items, ...items, ...items].map((it, i) => (
          <span key={i} className="flex items-center gap-12">
            <span>{it}</span>
            <span className="text-coral">★</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Pillars() {
  const pillars = [
    {
      n: "01",
      title: "It speaks first.",
      body:
        "Every block is announced before you have to think about it. Movement, target, three-second countdown, then the cues your form actually needs.",
    },
    {
      n: "02",
      title: "It reads the room.",
      body:
        "Live heart rate streams in from your wearable. If you're sandbagging zone two, the coach pushes; if you're cooked at threshold, it pulls back the next interval.",
    },
    {
      n: "03",
      title: "It works without signal.",
      body:
        "Installed as a PWA, the app shell, your plans, and recent sessions are cached. Subway, hotel gym, mountain trail — same coach.",
    },
    {
      n: "04",
      title: "It respects your time.",
      body:
        "Five-minute decompress between calls. Thirty-five-minute hotel-room strength. The brief takes one sentence and the plan starts the moment you say go.",
    },
  ];
  return (
    <section id="pillars" className="mt-28 sm:mt-36">
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        <div className="lg:col-span-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            Why it works
          </p>
        </div>
        <h2 className="lg:col-span-8 font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight">
          Most fitness apps want your eyes. <em className="italic">VoiceFitCoach asks for your attention</em>{" "}
          — and gives it back.
        </h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule rounded-3xl overflow-hidden border border-rule">
        {pillars.map((p) => (
          <article key={p.n} className="bg-paper p-8 sm:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              {p.n}
            </p>
            <h3 className="font-display text-3xl mt-3 max-w-[18ch] leading-[1.05]">{p.title}</h3>
            <p className="mt-4 text-ink-soft text-[15px] leading-relaxed max-w-prose">{p.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Workflow() {
  const steps = [
    {
      time: "07:42",
      label: "The brief",
      quote: "&ldquo;Build me a 25-minute fat-loss workout, dumbbells, but make the warm-up easy — my back's stiff.&rdquo;",
      body:
        "Voice intent parsed: goal=fat-loss, length=25, equipment=dumbbells, opening intensity capped. Coach assembles eight blocks and a wind-down.",
    },
    {
      time: "07:43",
      label: "The first move",
      quote: "&ldquo;Goblet squat. Six to eight reps, three count down. Three. Two. One.&rdquo;",
      body:
        "The phone goes in your pocket. The coach speaks every transition. Your wearable starts streaming heart rate.",
    },
    {
      time: "07:51",
      label: "Mid-session adapt",
      quote: "&ldquo;You're under zone three for the last two intervals. Adding ten seconds.&rdquo;",
      body:
        "Heart rate variance is below target — coach extends work bouts. You can override at any moment with a single phrase: easier, harder, skip, repeat.",
    },
    {
      time: "08:03",
      label: "Wind-down",
      quote: "&ldquo;Long exhale. Five breaths. That's the set.&rdquo;",
      body:
        "Calories logged, HR recovery captured, plan saved offline. Tomorrow's brief picks up where today left off.",
    },
  ];
  return (
    <section id="workflow" className="mt-28 sm:mt-36">
      <header className="flex flex-wrap items-baseline justify-between gap-4 mb-10">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">A typical session</p>
          <h2 className="font-display text-4xl sm:text-5xl mt-2 leading-tight">
            One sentence in. <em className="italic">Twenty-three minutes later</em>, you&rsquo;re back.
          </h2>
        </div>
        <p className="text-muted max-w-md text-sm">
          A real-world walk-through of how voice and wearable data shape a workout — without
          you ever opening a menu.
        </p>
      </header>

      <ol className="relative border-l border-rule pl-6 sm:pl-10 space-y-12">
        {steps.map((s, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[34px] sm:-left-[44px] top-1 size-3 rounded-full bg-coral ring-4 ring-bg" />
            <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-2 md:gap-8">
              <div>
                <p className="font-mono text-[12px] tracking-widest text-muted">{s.time}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted mt-0.5">{s.label}</p>
              </div>
              <div className="max-w-2xl">
                <p
                  className="font-display text-2xl sm:text-3xl leading-tight"
                  dangerouslySetInnerHTML={{ __html: s.quote }}
                />
                <p className="mt-3 text-ink-soft text-[15px] leading-relaxed">{s.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function FieldNotes() {
  const notes = [
    {
      who: "Sara, 34",
      role: "Product lead",
      body:
        "I run between calls now. Just say go and the next thirty minutes is decided for me. The pocket-mode is the whole pitch.",
    },
    {
      who: "Jonas, 41",
      role: "Surgeon",
      body:
        "I don't have spare seconds for app menus. This thing reads my Garmin and tells me when to push. It's a coach, not a screen.",
    },
    {
      who: "Mei, 29",
      role: "Founder",
      body:
        "The offline thing matters more than I expected. Long flights, hotel basements with no Wi-Fi, doesn't matter — same workout.",
    },
  ];
  return (
    <section className="mt-28 sm:mt-36">
      <header className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Field notes</p>
          <h2 className="font-display text-4xl sm:text-5xl mt-2">From the early users.</h2>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {notes.map((n, i) => (
          <figure key={i} className="card p-7">
            <blockquote className="font-display text-[22px] leading-snug">
              &ldquo;{n.body}&rdquo;
            </blockquote>
            <figcaption className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              {n.who} <span className="text-ink/60">— {n.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section
      id="cta"
      className="mt-28 sm:mt-36 rounded-[32px] bg-ink text-bg overflow-hidden relative"
    >
      <div className="absolute -top-32 -right-24 size-[420px] rounded-full bg-lime/30 blur-3xl drift" />
      <div className="absolute -bottom-32 -left-12 size-[360px] rounded-full bg-coral/20 blur-3xl drift" />
      <div className="relative z-10 px-7 sm:px-14 py-16 sm:py-24 grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-bg/60">
            Free during open beta
          </p>
          <h2 className="font-display text-5xl sm:text-7xl leading-[0.95] tracking-tight mt-3">
            Add it to your home screen.
            <br />
            <em className="italic text-lime">Then talk to it.</em>
          </h2>
        </div>
        <div className="md:col-span-4 text-bg/80">
          <p className="text-base leading-relaxed">
            VoiceFitCoach installs as a Progressive Web App — no store, no download. Works in
            airplane mode the second time you open it.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href="#coach"
              className="btn bg-lime text-ink hover:bg-lime-deep px-5 py-3"
            >
              Talk to the coach
            </a>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-bg/60 self-center">
              No signup, no card
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-paper/60 mt-20">
      <div className="mx-auto max-w-7xl w-full px-5 sm:px-8 py-10 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center size-7 rounded-md bg-ink text-bg">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12h3l3-7 4 14 3-7h7" />
            </svg>
          </span>
          <span className="font-display text-base">VoiceFitCoach</span>
          <span className="font-mono text-[11px] text-muted ml-3">© {new Date().getFullYear()} — Built for hands.</span>
        </div>
        <div className="flex flex-wrap gap-5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          <span>Voice · Web Speech API</span>
          <span>Wearable · BLE / Health Kit</span>
          <span>Offline · Service Worker</span>
        </div>
      </div>
    </footer>
  );
}
