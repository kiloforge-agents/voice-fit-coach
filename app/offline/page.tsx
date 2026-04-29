export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <main className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center text-center px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        No signal · cached coach available
      </p>
      <h1 className="font-display text-5xl sm:text-7xl mt-4 leading-[0.95] max-w-3xl">
        You&rsquo;re offline. The coach is not.
      </h1>
      <p className="mt-6 max-w-prose text-ink-soft text-lg">
        VoiceFitCoach is installed and ready. Open the home screen icon to start a workout — your
        last plan is cached, the voice runtime works locally, and we&rsquo;ll sync your session when
        you&rsquo;re back online.
      </p>
      <a href="/" className="btn btn-primary mt-9">
        Reload the coach
      </a>
    </main>
  );
}
