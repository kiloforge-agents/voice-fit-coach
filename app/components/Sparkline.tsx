"use client";

import { useMemo } from "react";

interface Props {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  className?: string;
}

export default function Sparkline({
  values,
  width = 220,
  height = 56,
  stroke = "var(--ink)",
  fill = "transparent",
  className = "",
}: Props) {
  const path = useMemo(() => {
    if (!values.length) return "";
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const stepX = width / Math.max(1, values.length - 1);
    return values
      .map((v, i) => {
        const x = i * stepX;
        const y = height - ((v - min) / span) * (height - 4) - 2;
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  }, [values, width, height]);

  const area = useMemo(() => {
    if (!values.length) return "";
    return `${path} L${width},${height} L0,${height} Z`;
  }, [path, values.length, width, height]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label="Live heart-rate trend"
    >
      {fill !== "transparent" && <path d={area} fill={fill} />}
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
