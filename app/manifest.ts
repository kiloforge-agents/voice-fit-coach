import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VoiceFitCoach",
    short_name: "VoiceFit",
    description:
      "Voice-activated, AI-personalized fitness coach with real-time wearable feedback. Works offline.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f3eee2",
    theme_color: "#f3eee2",
    categories: ["fitness", "health", "lifestyle", "productivity"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      {
        src: "/maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Start a workout",
        short_name: "Start",
        url: "/?action=start",
        description: "Jump straight into a hands-free workout session.",
      },
      {
        name: "Open coach chat",
        short_name: "Coach",
        url: "/?action=coach",
        description: "Talk to your AI coach.",
      },
    ],
  };
}
