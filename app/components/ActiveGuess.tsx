"use client";

import { useEffect, useRef } from "react";

interface Props {
  /** Mission duration chosen by the grown-up, in minutes */
  missionMinutes: number;
  /**
   * Called when the kid taps STOP.
   * Receives the elapsed time in milliseconds so Screen 3 can score it.
   */
  onStop: (elapsedMs: number) => void;
}

/**
 * Screen 2 — Active Guess Screen
 *
 * Shown to the kid after the grown-up launches. No clock visible.
 * A giant pulsing STOP button fills the centre. On tap, elapsed time
 * is recorded and passed up to the parent for the results screen.
 *
 * Edge cases:
 * - startRef is set on first render so elapsed time is always ≥ 0.
 * - A "stopped" guard prevents double-fires from rapid taps or touch+click.
 * - The button is sized with a min of 208 px (w-52) scaling to w-64 on md+,
 *   matching the mockup's 200 px+ requirement.
 */
export default function ActiveGuess({ missionMinutes, onStop }: Props) {
  // Record the exact moment this screen mounts as the mission start time.
  const startRef = useRef<number>(Date.now());
  // Prevent double-fire if the user taps rapidly.
  const stoppedRef = useRef<boolean>(false);

  // Reset start time whenever a new mission begins (missionMinutes changes).
  useEffect(() => {
    startRef.current = Date.now();
    stoppedRef.current = false;
  }, [missionMinutes]);

  function handleStop() {
    if (stoppedRef.current) return;
    stoppedRef.current = true;
    const elapsedMs = Date.now() - startRef.current;
    onStop(elapsedMs);
  }

  const minuteLabel = missionMinutes === 1 ? "1 Minute" : `${missionMinutes} Minutes`;

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
        // Subtle gradient matching the mockup's Screen 2 background
        background: "linear-gradient(180deg, #030a1a 0%, #05101f 100%)",
      }}
    >
      {/* ── Orbit rings decoration ───────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          className="orbit-ring"
          style={{ width: 420, height: 420, position: "absolute" }}
        />
        <div
          className="orbit-ring-2"
          style={{ width: 580, height: 580, position: "absolute" }}
        />
        <div
          className="orbit-ring"
          style={{
            width: 720,
            height: 720,
            position: "absolute",
            animationDuration: "30s",
          }}
        />
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Status pill */}
        <div
          style={{
            background: "rgba(30,41,59,0.6)",
            border: "1px solid rgba(71,85,105,0.4)",
            borderRadius: 9999,
            padding: "0.5rem 1.5rem",
            marginBottom: "2rem",
            backdropFilter: "blur(4px)",
          }}
        >
          <p
            style={{
              fontFamily: "'Orbitron', monospace",
              color: "#fb923c",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            🛸 Mission Active · {minuteLabel}
          </p>
        </div>

        {/* Headline */}
        <h2
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(1.5rem, 5vw, 2rem)",
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1.3,
            margin: "0 0 0.5rem",
          }}
        >
          YOU&apos;RE IN
          <br />
          <span style={{ color: "#fb923c" }}>DEEP SPACE!</span>
        </h2>

        {/* Instruction — matches task spec: "Stop when you think time is up!" */}
        <p
          style={{
            color: "#94a3b8",
            fontWeight: 700,
            fontSize: "1rem",
            lineHeight: 1.6,
            margin: "0 0 2.5rem",
            maxWidth: "24rem",
          }}
        >
          Stop when you think time is up!
          <br />
          <span style={{ color: "#64748b", fontSize: "0.875rem" }}>
            No peeking at the clock, Commander! 👀
          </span>
        </p>

        {/* ── BIG PULSING STOP BUTTON ───────────────────── */}
        {/*
          Security / a11y note:
          - type="button" prevents accidental form submission.
          - aria-label gives screen-reader context.
          - min size: 208px (w-52) → 256px (w-64 on md+), satisfying the ≥200px spec.
        */}
        <button
          type="button"
          aria-label="Stop the timer"
          className="stop-btn"
          onClick={handleStop}
          style={{
            width: "clamp(208px, 40vw, 256px)",
            height: "clamp(208px, 40vw, 256px)",
            borderRadius: "50%",
            border: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            marginBottom: "2.5rem",
            userSelect: "none",
            WebkitUserSelect: "none",
            // Override default browser focus outline with something visible
            outline: "none",
          }}
        >
          <span
            style={{
              fontFamily: "'Orbitron', monospace",
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "clamp(2rem, 8vw, 3rem)",
              letterSpacing: "0.15em",
              lineHeight: 1,
            }}
          >
            STOP
          </span>
          <span
            style={{
              color: "#fed7aa", // orange-200
              fontSize: "0.8rem",
              fontWeight: 700,
              marginTop: "0.5rem",
              letterSpacing: "0.08em",
            }}
          >
            TAP WHEN READY
          </span>
        </button>

        {/* Ambient hint */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#475569",
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          {/* Pinging dot — using inline style + CSS animation via keyframes in globals */}
          <span
            style={{
              width: 8,
              height: 8,
              background: "#f97316",
              borderRadius: "50%",
              display: "inline-block",
              animation: "pulse-stop 1.8s ease-in-out infinite",
            }}
          />
          No peeking at the clock, Commander!
        </div>

        {/* Floating planet decorations — purely cosmetic */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            right: -48,
            opacity: 0.3,
            fontSize: "3rem",
            pointerEvents: "none",
            userSelect: "none",
            animation: "float-planet 4s ease-in-out infinite",
          }}
        >
          🪐
        </div>
      </div>

      {/* Floating planet CSS — self-contained keyframe */}
      <style>{`
        @keyframes float-planet {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
