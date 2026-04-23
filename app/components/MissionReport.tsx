"use client";

import { useEffect, useRef, useState } from "react";

// ─── Badge tiers ────────────────────────────────────────────────────────────
// within  5s → 🌟 Space Commander!
// within 15s → 🚀 Astronaut!
// within 30s → 🪐 Space Cadet!
// beyond 30s → 🛸 Lost in Space…

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
 * - Animated badge based on accuracy tier (badge-enter bounce-in)
 * - Target time, actual stop time, diff (animated count-up)
 * - Staggered entrance for all sections
 * - Rank tier legend chips (wraps nicely on narrow screens)
 * - "Try again, Commander?" CTA
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

  // Unique ID suffix avoids SVG gradient ID collisions
  const uid = useRef(Math.random().toString(36).slice(2, 7)).current;
  const goldGradId = `goldGrad-${uid}`;
  const badgeBgId = `badgeBg-${uid}`;

  const sign =
    actualSeconds < targetSeconds ? "–" : actualSeconds > targetSeconds ? "+" : "";

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
        padding: "2rem 1.25rem 3rem",
        textAlign: "center",
        fontFamily: "'Nunito', sans-serif",
        background:
          "radial-gradient(ellipse at center, rgba(12,26,58,0.7) 0%, transparent 70%)",
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
        {/* ── Mission Report heading ────────────────────────────────────── */}
        <div
          className="card-slide-up"
          style={{
            fontFamily: "'Orbitron', monospace",
            color: "#fb923c",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "1.25rem",
          }}
        >
          📡 Mission Report
        </div>

        {/* ── Badge (bounce-in entrance + continuous glow pulse) ─────────── */}
        <div className="badge-enter" style={{ marginBottom: "1.25rem" }}>
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
                style={{
                  fontFamily: "'Orbitron', monospace",
                  color: "#fde047",
                  fontWeight: 900,
                  fontSize: "0.65rem",
                  marginTop: "0.35rem",
                  letterSpacing: "0.05em",
                  lineHeight: 1.25,
                  textAlign: "center",
                }}
              >
                {badge.line1}
                <br />
                {badge.line2}
              </span>
            </div>
          </div>
        </div>

        {/* ── Tier headline + subline ───────────────────────────────────── */}
        <div className="card-slide-up delay-200" style={{ marginBottom: "1.25rem" }}>
          <h2
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(1.4rem, 5vw, 1.75rem)",
              fontWeight: 900,
              color: "#ffffff",
              margin: "0 0 0.4rem",
              letterSpacing: "0.04em",
              textShadow: "0 0 30px rgba(255,255,255,0.1)",
            }}
          >
            {badge.headline}
          </h2>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "0.95rem",
              fontWeight: 600,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {badge.subline}
          </p>
        </div>

        {/* ── Stats card ───────────────────────────────────────────────── */}
        <div
          className="card-slide-up delay-300"
          style={{
            background: "rgba(30,41,59,0.65)",
            border: "1px solid rgba(51,65,85,0.55)",
            borderRadius: "1rem",
            padding: "1.25rem 1rem",
            width: "100%",
            marginBottom: "1.5rem",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "0.75rem",
            }}
          >
            {/* Target */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Orbitron', monospace",
                  color: "#fb923c",
                  fontWeight: 900,
                  fontSize: "clamp(1rem, 4vw, 1.25rem)",
                }}
              >
                {formatTime(targetSeconds)}
              </div>
              <div
                style={{
                  color: "#64748b",
                  fontSize: "0.65rem",
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
                borderLeft: "1px solid #1e293b",
                borderRight: "1px solid #1e293b",
              }}
            >
              <div
                style={{
                  fontFamily: "'Orbitron', monospace",
                  color: "#ffffff",
                  fontWeight: 900,
                  fontSize: "clamp(1rem, 4vw, 1.25rem)",
                }}
              >
                {formatTime(actualSeconds)}
              </div>
              <div
                style={{
                  color: "#64748b",
                  fontSize: "0.65rem",
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
                className={`count-up-pop ${badge.diffColour}`}
                key={displayDiff}
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontWeight: 900,
                  fontSize: "clamp(1rem, 4vw, 1.25rem)",
                }}
              >
                {sign}
                {displayDiff}s
              </div>
              <div
                style={{
                  color: "#64748b",
                  fontSize: "0.65rem",
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

        {/* ── Rank tier legend chips ────────────────────────────────────── */}
        {/*
          Uses rank-chips class (defined in globals.css) for flex-wrap layout.
          Each chip is sized to fit on one line but the row wraps gracefully
          on very narrow phones.
        */}
        <div className="rank-chips card-slide-up delay-400">
          {[
            {
              bg: "rgba(234,179,8,0.15)",
              border: "rgba(234,179,8,0.4)",
              color: "#fde047",
              label: "🌟 Commander · <5s",
            },
            {
              bg: "rgba(59,130,246,0.15)",
              border: "rgba(59,130,246,0.4)",
              color: "#93c5fd",
              label: "🚀 Astronaut · <15s",
            },
            {
              bg: "rgba(168,85,247,0.15)",
              border: "rgba(168,85,247,0.4)",
              color: "#d8b4fe",
              label: "🪐 Cadet · <30s",
            },
            {
              bg: "rgba(100,116,139,0.15)",
              border: "rgba(100,116,139,0.4)",
              color: "#cbd5e1",
              label: "🛸 Lost · 30s+",
            },
          ].map(({ bg, border, color, label }) => (
            <span
              key={label}
              style={{
                background: bg,
                border: `1px solid ${border}`,
                color,
                fontSize: "0.68rem",
                fontWeight: 700,
                padding: "0.35rem 0.65rem",
                borderRadius: "9999px",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* ── CTA buttons ──────────────────────────────────────────────── */}
        <div
          className="card-slide-up delay-500"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            width: "100%",
          }}
        >
          <button
            className="launch-btn-shine"
            onClick={onPlayAgain}
            style={{
              fontFamily: "'Orbitron', monospace",
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
            🚀&nbsp;&nbsp;PLAY AGAIN
          </button>

          <button
            onClick={onPlayAgain}
            style={{
              background: "transparent",
              border: "1px solid rgba(51,65,85,0.8)",
              color: "#94a3b8",
              fontWeight: 700,
              fontSize: "0.875rem",
              padding: "0.75rem 2rem",
              borderRadius: "1rem",
              cursor: "pointer",
              width: "100%",
              transition: "border-color 0.2s, color 0.2s",
              fontFamily: "'Nunito', sans-serif",
              // Remove tap highlight on mobile
              WebkitTapHighlightColor: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(249,115,22,0.5)";
              (e.currentTarget as HTMLButtonElement).style.color = "#fb923c";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(51,65,85,0.8)";
              (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
            }}
          >
            Try again, Commander?&nbsp;👨‍🚀
          </button>
        </div>
      </div>
    </div>
  );
}
