"use client";

interface Props {
  active: boolean;
  className?: string;
}

export default function Equalizer({ active, className = "" }: Props) {
  const bars = [0.2, 0.45, 0.7, 0.55, 0.85, 0.4, 0.6];
  return (
    <div className={`flex items-end gap-[3px] h-5 ${className}`}>
      {bars.map((h, i) => (
        <span
          key={i}
          className={`block w-[3px] rounded-full bg-current ${active ? "eq-bar" : "opacity-30"}`}
          style={{
            height: `${Math.max(20, h * 100)}%`,
            animationDelay: active ? `${i * 0.08}s` : undefined,
          }}
        />
      ))}
    </div>
  );
}
