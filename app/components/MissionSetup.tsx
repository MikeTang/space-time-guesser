"use client";

import { useState, useEffect, useCallback } from "react";

// Duration options matching the design mockup
const DURATIONS: { minutes: number; emoji: string; label: string }[] = [
  { minutes: 1, emoji: "🚀", label: "Orbit Run" },
  { minutes: 2, emoji: "🛸", label: "Space\nPatrol" },
  { minutes: 5, emoji: "🌌", label: "Galaxy\nTrek" },
];

interface Props {
  /** Called when the 3-2-1 countdown finishes — passes the chosen minutes */
  onLaunch: (minutes: number) => void;
}

export default function MissionSetup({ onLaunch }: Props) {
  const [selected, setSelected] = useState<number>(1);
  // null = idle, 3/2/1 = counting, 0 = launching
  const [countdown, setCountdown] = useState<number | null>(null);

  // Run 3-2-1 countdown then hand off to parent
  const handleLaunch = useCallback(() => {
    if (countdown !== null) return; // prevent double-tap
    setCountdown(3);
  }, [countdown]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      // Small delay so the "🚀" frame is visible before transition
      const tid = setTimeout(() => {
        setCountdown(null);
        onLaunch(selected);
      }, 400);
      return () => clearTimeout(tid);
    }
    const tid = setTimeout(() => setCountdown((c) => (c ?? 1) - 1), 900);
    return () => clearTimeout(tid);
  }, [countdown, selected, onLaunch]);

  const isLaunching = countdown !== null;

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
        // Extra bottom padding so content clears the browser chrome on mobile
        padding: "2rem 1.25rem 3rem",
      }}
    >
      {/* ── Countdown overlay ──────────────────────────────── */}
      {isLaunching && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(3,10,26,0.88)",
            backdropFilter: "blur(6px)",
          }}
          aria-live="assertive"
        >
          <span
            key={countdown} // re-mount to re-trigger animation each tick
            className="countdown-num"
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(6rem, 22vw, 11rem)",
              fontWeight: 900,
              color: countdown === 0 ? "#fb923c" : "#ffffff",
              lineHeight: 1,
              textShadow:
                countdown === 0
                  ? "0 0 80px rgba(251,146,60,0.95), 0 0 160px rgba(251,146,60,0.4)"
                  : "0 0 50px rgba(255,255,255,0.7)",
            }}
          >
            {countdown === 0 ? "🚀" : countdown}
          </span>
        </div>
      )}

      {/* ── Header ────────────────────────────────────────── */}
      <div
        className="screen-enter-fade"
        style={{ textAlign: "center", marginBottom: "2rem" }}
      >
        {/* Rocket SVG — matches mockup exactly */}
        <div
          style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}
        >
          <svg
            width="72"
            height="72"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="32" cy="32" rx="32" ry="32" fill="rgba(251,146,60,0.1)" />
            {/* Body */}
            <path
              d="M32 8 C32 8 20 22 20 38 L32 44 L44 38 C44 22 32 8 32 8Z"
              fill="#e2e8f0"
            />
            <path d="M32 8 C32 8 26 22 26 38 L32 44 L32 8Z" fill="#cbd5e1" />
            {/* Window */}
            <circle
              cx="32"
              cy="28"
              r="5"
              fill="#38bdf8"
              stroke="#0ea5e9"
              strokeWidth="1.5"
            />
            {/* Fins */}
            <path d="M20 36 L14 46 L20 42 Z" fill="#fb923c" />
            <path d="M44 36 L50 46 L44 42 Z" fill="#fb923c" />
            {/* Flame */}
            <path
              className="flame"
              d="M28 44 Q32 54 36 44 Q32 50 28 44Z"
              fill="#fbbf24"
            />
            <path
              className="flame"
              d="M29 44 Q32 51 35 44 Q32 48 29 44Z"
              fill="#fb923c"
            />
          </svg>
        </div>

        <h1
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(1.75rem, 7vw, 2.75rem)",
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "0.05em",
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          SPACE TIME
          <br />
          <span style={{ color: "#fb923c" }}>GUESSER</span>
        </h1>
        <p
          style={{
            color: "#94a3b8",
            marginTop: "0.75rem",
            fontSize: "1rem",
            fontWeight: 600,
          }}
        >
          Can you feel the seconds ticking?&nbsp;🚀
        </p>
      </div>

      {/* ── Mission briefing card ──────────────────────────── */}
      <div
        className="card-slide-up delay-100"
        style={{
          background: "rgba(30,41,59,0.5)",
          border: "1px solid rgba(71,85,105,0.6)",
          borderRadius: "1rem",
          padding: "1rem 1.5rem",
          marginBottom: "2rem",
          maxWidth: "28rem",
          width: "100%",
          textAlign: "center",
          backdropFilter: "blur(4px)",
        }}
      >
        <p
          style={{
            color: "#cbd5e1",
            fontSize: "0.875rem",
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          <span style={{ color: "#fb923c", fontWeight: 700 }}>Grown-up:</span> Pick a
          mission length, hit{" "}
          <span style={{ color: "#fb923c", fontWeight: 700 }}>LAUNCH</span>, then hand
          the device to your little astronaut!&nbsp;🌟
        </p>
      </div>

      {/* ── Mission length label ───────────────────────────── */}
      <p
        className="delay-200"
        style={{
          color: "#94a3b8",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: "1rem",
          animationFillMode: "both",
        }}
      >
        Mission Length
      </p>

      {/* ── Duration cards ────────────────────────────────── */}
      <div
        className="card-slide-up delay-200"
        style={{
          display: "flex",
          gap: "0.875rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "32rem",
          width: "100%",
        }}
      >
        {DURATIONS.map(({ minutes, emoji, label }) => (
          <button
            key={minutes}
            onClick={() => setSelected(minutes)}
            className={`duration-card${selected === minutes ? " selected" : ""}`}
            style={{
              flex: "1 1 96px",
              minWidth: "96px",
              maxWidth: "136px",
              // Generous touch target — at least 44 × 44 px (WCAG 2.5.5)
              padding: "1.25rem 0.75rem",
              textAlign: "center",
              // Selected gets an extra violet ring per task spec
              outline:
                selected === minutes
                  ? "3px solid #a855f7"
                  : "3px solid transparent",
              outlineOffset: "2px",
              background: "none",
              cursor: "pointer",
              border: selected === minutes
                ? "2px solid #fb923c"
                : "2px solid rgba(255,255,255,0.12)",
            }}
            aria-pressed={selected === minutes}
          >
            <div style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>{emoji}</div>
            <div
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "1.5rem",
                fontWeight: 900,
                color: "#ffffff",
              }}
            >
              {minutes}
            </div>
            <div
              style={{
                color: "#fb923c",
                fontWeight: 700,
                fontSize: "0.7rem",
                marginTop: "0.25rem",
                letterSpacing: "0.08em",
              }}
            >
              MINUTES
            </div>
            <div
              style={{
                color: "#94a3b8",
                fontSize: "0.7rem",
                marginTop: "0.5rem",
                fontWeight: 600,
                whiteSpace: "pre-line",
                lineHeight: 1.3,
              }}
            >
              {label}
            </div>
          </button>
        ))}
      </div>

      {/* Selected indicator */}
      <p
        style={{
          color: "#64748b",
          fontSize: "0.7rem",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "1.25rem",
        }}
      >
        Selected:{" "}
        <span style={{ color: "#fb923c" }}>
          {selected} {selected === 1 ? "Minute" : "Minutes"}
        </span>
      </p>

      {/* ── Launch button ─────────────────────────────────── */}
      <button
        onClick={handleLaunch}
        disabled={isLaunching}
        className="launch-btn-shine card-slide-up delay-300"
        style={{
          fontFamily: "'Orbitron', monospace",
          color: "#ffffff",
          fontWeight: 900,
          fontSize: "1.2rem",
          padding: "1.1rem 3rem",
          borderRadius: "1rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          border: "none",
          cursor: isLaunching ? "not-allowed" : "pointer",
          // Ensure the button is wide enough to feel satisfying to tap
          minWidth: "min(220px, 80vw)",
        }}
      >
        🚀&nbsp;&nbsp;LAUNCH
      </button>

      <p
        style={{
          color: "#475569",
          fontSize: "0.68rem",
          marginTop: "1.5rem",
          fontWeight: 600,
          letterSpacing: "0.05em",
        }}
      >
        No login needed · Runs in your browser
      </p>
    </div>
  );
}
