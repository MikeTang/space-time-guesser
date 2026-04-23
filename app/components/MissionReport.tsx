"use client";

import { useEffect, useRef, useState } from "react";

// ─── Badge tiers (task spec) ────────────────────────────────────────────────
// within  5s → 🌟 Space Commander!
// within 15s → 🚀 Astronaut!
// within 30s → 🪐 Space Cadet!
// beyond 30s → 🛸 Lost in Space…
//
// Note: the design mockup uses slightly different badge copy/emoji, but the
// task description is the authoritative spec for badge logic and copy.

interface BadgeTier {
  emoji: string;
  /** Two-line label split for the badge face */
  line1: string;
  line2: string;
  /** Headline shown below the badge */
  headline: string;
  /** Subline shown below the headline */
  subline: string;
  /** Tailwind colour class for the diff value */
  diffColour: string;
  /** Gradient stop colours for the dashed ring */
  gradStart: string;
  gradEnd: string;
}

const TIERS: { maxDiff: number; tier: BadgeTier }[] = [
  {
    maxDiff: 5,
    tier: {
      emoji: "🌟",
      line1: "SPACE",
      line2: "COMMANDER",
      headline: "AMAZING GUESS!",
      subline: "You stopped with stellar precision, Commander!",
      diffColour: "text-green-400",
      gradStart: "#fbbf24",
      gradEnd: "#f59e0b",
    },
  },
  {
    maxDiff: 15,
    tier: {
      emoji: "🚀",
      line1: "ASTRO-",
      line2: "NAUT!",
      headline: "GREAT TIMING!",
      subline: "Solid work out there, Astronaut!",
      diffColour: "text-blue-400",
      gradStart: "#60a5fa",
      gradEnd: "#3b82f6",
    },
  },
  {
    maxDiff: 30,
    tier: {
      emoji: "🪐",
      line1: "SPACE",
      line2: "CADET!",
      headline: "NICE TRY!",
      subline: "You're on your way, Space Cadet!",
      diffColour: "text-purple-400",
      gradStart: "#c084fc",
      gradEnd: "#a855f7",
    },
  },
  {
    maxDiff: Infinity,
    tier: {
      emoji: "🛸",
      line1: "LOST IN",
      line2: "SPACE…",
      headline: "OUT THERE!",
      subline: "The cosmos is vast — keep practising!",
      diffColour: "text-slate-400",
      gradStart: "#94a3b8",
      gradEnd: "#64748b",
    },
  },
];

function getBadge(diffSeconds: number): BadgeTier {
  // diffSeconds is always non-negative (we take Math.abs upstream)
  const entry = TIERS.find((t) => diffSeconds <= t.maxDiff)!;
  return entry.tier;
}

/** Format seconds as m:ss */
function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

interface Props {
  /** Duration the grown-up picked, in minutes */
  missionMinutes: number;
  /** How many milliseconds the kid actually waited */
  elapsedMs: number;
  /** Reset back to Screen 1 */
  onPlayAgain: () => void;
}

/**
 * Screen 3 — Mission Report
 *
 * Shows:
 * - Animated badge based on accuracy tier
 * - Target time, actual stop time, diff (animated count-up)
 * - Rank tier legend chips
 * - "Try again, Commander?" CTA
 *
 * Edge cases:
 * - diff is clamped to whole seconds (floor) so we never show a fraction.
 * - elapsedMs=0 is valid (instant tap) — diff will equal full mission time.
 * - Count-up interval is cleared on unmount to avoid memory leaks.
 * - The SVG gradient IDs are unique per component instance via a stable suffix
 *   so multiple SVGs on the same page (e.g. storybook) don't clash.
 */
export default function MissionReport({
  missionMinutes,
  elapsedMs,
  onPlayAgain,
}: Props) {
  const targetSeconds = missionMinutes * 60;
  const actualSeconds = Math.floor(elapsedMs / 1000);
  const diffSeconds = Math.abs(targetSeconds - actualSeconds);

  const badge = getBadge(diffSeconds);

  // ── Count-up animation for the diff number ──────────────────────────────
  const [displayDiff, setDisplayDiff] = useState(0);
  const rafRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Reset when the result changes (e.g. Play Again then Stop again)
    setDisplayDiff(0);

    if (diffSeconds === 0) {
      setDisplayDiff(0);
      return;
    }

    const duration = Math.min(1500, diffSeconds * 60); // max 1.5s animation
    const steps = Math.max(diffSeconds, 1);
    const stepMs = duration / steps;
    let current = 0;

    rafRef.current = setInterval(() => {
      current += 1;
      setDisplayDiff(current);
      if (current >= diffSeconds) {
        clearInterval(rafRef.current!);
      }
    }, stepMs);

    return () => {
      if (rafRef.current) clearInterval(rafRef.current);
    };
  }, [diffSeconds]);

  // Unique ID suffix avoids SVG gradient ID collisions if component mounts
  // multiple times in the same document (tests, storybook).
  const uid = useRef(Math.random().toString(36).slice(2, 7)).current;
  const goldGradId = `goldGrad-${uid}`;
  const badgeBgId = `badgeBg-${uid}`;

  const sign = actualSeconds < targetSeconds ? "–" : actualSeconds > targetSeconds ? "+" : "";

  return (
    <div
      style={{
        position: "relative",
        zIndex: 10,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        textAlign: "center",
        fontFamily: "'Nunito', sans-serif",
        background: "radial-gradient(ellipse at center, #0c1a3a 0%, #030a1a 70%)",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "28rem",
        }}
      >
        {/* ── Mission Report heading ──────────────────────────────────────── */}
        <div
          className="orbitron"
          style={{
            color: "#fb923c",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
        >
          📡 Mission Report
        </div>

        {/* ── Badge ──────────────────────────────────────────────────────── */}
        <div className="badge-glow" style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              width: "10rem",
              height: "10rem",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Dashed outer ring + filled background */}
            <svg
              viewBox="0 0 200 200"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            >
              <circle
                cx="100"
                cy="100"
                r="92"
                fill="none"
                stroke={`url(#${goldGradId})`}
                strokeWidth="6"
                strokeDasharray="8 4"
              />
              <circle cx="100" cy="100" r="78" fill={`url(#${badgeBgId})`} />
              <defs>
                <linearGradient id={goldGradId} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={badge.gradStart} />
                  <stop offset="100%" stopColor={badge.gradEnd} />
                </linearGradient>
                <radialGradient id={badgeBgId} cx="40%" cy="35%">
                  <stop offset="0%" stopColor="#1e3a6e" />
                  <stop offset="100%" stopColor="#0f1f40" />
                </radialGradient>
              </defs>
            </svg>

            {/* Badge face content */}
            <div
              style={{
                position: "relative",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "2.5rem", lineHeight: 1 }}>{badge.emoji}</span>
              <span
                className="orbitron"
                style={{
                  color: "#fde047",
                  fontWeight: 900,
                  fontSize: "0.7rem",
                  marginTop: "0.25rem",
                  lineHeight: 1.2,
                  letterSpacing: "0.05em",
                }}
              >
                {badge.line1}
              </span>
              <span
                className="orbitron"
                style={{
                  color: "#fde047",
                  fontWeight: 900,
                  fontSize: "0.7rem",
                  lineHeight: 1.2,
                  letterSpacing: "0.05em",
                }}
              >
                {badge.line2}
              </span>
            </div>
          </div>
        </div>

        {/* ── Headline ───────────────────────────────────────────────────── */}
        <h2
          className="orbitron"
          style={{
            fontSize: "clamp(1.5rem, 4vw, 1.875rem)",
            fontWeight: 900,
            color: "#ffffff",
            marginBottom: "0.5rem",
          }}
        >
          {badge.headline}
        </h2>
        <p
          style={{
            color: "#94a3b8",
            fontWeight: 700,
            fontSize: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          {badge.subline}
        </p>

        {/* ── Stats panel ────────────────────────────────────────────────── */}
        <div
          style={{
            background: "rgba(30,41,59,0.6)",
            border: "1px solid rgba(51,65,85,0.5)",
            borderRadius: "1rem",
            padding: "1.5rem",
            width: "100%",
            marginBottom: "1.5rem",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1rem",
            }}
          >
            {/* Target */}
            <div style={{ textAlign: "center" }}>
              <div
                className="orbitron"
                style={{ color: "#fb923c", fontWeight: 900, fontSize: "1.25rem" }}
              >
                {formatTime(targetSeconds)}
              </div>
              <div
                style={{
                  color: "#64748b",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  marginTop: "0.25rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Target
              </div>
            </div>

            {/* Your Stop */}
            <div
              style={{
                textAlign: "center",
                borderLeft: "1px solid #334155",
                borderRight: "1px solid #334155",
              }}
            >
              <div
                className="orbitron"
                style={{ color: "#ffffff", fontWeight: 900, fontSize: "1.25rem" }}
              >
                {formatTime(actualSeconds)}
              </div>
              <div
                style={{
                  color: "#64748b",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  marginTop: "0.25rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Your Stop
              </div>
            </div>

            {/* Off By (animated count-up) */}
            <div style={{ textAlign: "center" }}>
              <div
                className={`orbitron count-up-pop ${badge.diffColour}`}
                // key forces remount / re-animation when value changes
                key={displayDiff}
                style={{ fontWeight: 900, fontSize: "1.25rem" }}
              >
                {sign}{displayDiff}s
              </div>
              <div
                style={{
                  color: "#64748b",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  marginTop: "0.25rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Off By
              </div>
            </div>
          </div>
        </div>

        {/* ── Rank tier legend ───────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              background: "rgba(234,179,8,0.2)",
              border: "1px solid rgba(234,179,8,0.4)",
              color: "#fde047",
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "0.375rem 0.75rem",
              borderRadius: "9999px",
            }}
          >
            🌟 Space Commander · &lt;5s
          </span>
          <span
            style={{
              background: "rgba(59,130,246,0.2)",
              border: "1px solid rgba(59,130,246,0.4)",
              color: "#93c5fd",
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "0.375rem 0.75rem",
              borderRadius: "9999px",
            }}
          >
            🚀 Astronaut · &lt;15s
          </span>
          <span
            style={{
              background: "rgba(168,85,247,0.2)",
              border: "1px solid rgba(168,85,247,0.4)",
              color: "#d8b4fe",
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "0.375rem 0.75rem",
              borderRadius: "9999px",
            }}
          >
            🪐 Space Cadet · &lt;30s
          </span>
          <span
            style={{
              background: "rgba(100,116,139,0.2)",
              border: "1px solid rgba(100,116,139,0.4)",
              color: "#cbd5e1",
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "0.375rem 0.75rem",
              borderRadius: "9999px",
            }}
          >
            🛸 Lost in Space · 30s+
          </span>
        </div>

        {/* ── CTA buttons ────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            width: "100%",
          }}
        >
          <button
            className="launch-btn orbitron"
            onClick={onPlayAgain}
            style={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "1rem",
              padding: "1rem 2rem",
              borderRadius: "1rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              width: "100%",
              border: "none",
            }}
          >
            🚀 &nbsp;PLAY AGAIN
          </button>

          {/* "Try again, Commander?" is identical in behaviour to Play Again
              per the task spec — it just resets to Screen 1 */}
          <button
            onClick={onPlayAgain}
            style={{
              background: "transparent",
              border: "1px solid #334155",
              color: "#94a3b8",
              fontWeight: 700,
              fontSize: "0.875rem",
              padding: "0.75rem 2rem",
              borderRadius: "1rem",
              cursor: "pointer",
              width: "100%",
              transition: "border-color 0.2s, color 0.2s",
              fontFamily: "'Nunito', sans-serif",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(249,115,22,0.5)";
              (e.currentTarget as HTMLButtonElement).style.color = "#fb923c";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#334155";
              (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
            }}
          >
            Try again, Commander? 👨‍🚀
          </button>
        </div>
      </div>
    </div>
  );
}
