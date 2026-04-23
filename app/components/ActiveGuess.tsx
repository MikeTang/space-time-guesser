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
 * Design polish notes:
 * - STOP button uses stop-btn-enter class so it bounces in then pulses.
 * - All content has staggered entrance via card-slide-up + delay-* classes.
 * - Button size uses clamp(220px, 55vw, 280px) for a comfortable thumb target
 *   on phones as small as 320 px wide.
 * - touch-action: manipulation on the button removes the 300 ms tap delay.
 * - The background is transparent so nebula blobs + stars show through.
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
        padding: "2rem 1.25rem 3rem",
        textAlign: "center",
        fontFamily: "'Nunito', sans-serif",
        // Keep background transparent so the global star/nebula layer shows through.
        // The subtle overlay tint is achieved via a very soft radial gradient.
        background:
          "radial-gradient(ellipse at 50% 60%, rgba(5,16,31,0.6) 0%, transparent 70%)",
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
          className="card-slide-up"
          style={{
            background: "rgba(30,41,59,0.7)",
            border: "1px solid rgba(71,85,105,0.5)",
            borderRadius: 9999,
            padding: "0.5rem 1.5rem",
            marginBottom: "1.75rem",
            backdropFilter: "blur(8px)",
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
            🛸 Mission Active&nbsp;·&nbsp;{minuteLabel}
          </p>
        </div>

        {/* Headline */}
        <h2
          className="card-slide-up delay-100"
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(1.6rem, 6vw, 2.2rem)",
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1.25,
            margin: "0 0 0.5rem",
            textShadow: "0 0 40px rgba(255,255,255,0.1)",
          }}
        >
          YOU&apos;RE IN
          <br />
          <span style={{ color: "#fb923c" }}>DEEP SPACE!</span>
        </h2>

        {/* Instruction */}
        <p
          className="card-slide-up delay-200"
          style={{
            color: "#94a3b8",
            fontWeight: 700,
            fontSize: "1rem",
            lineHeight: 1.6,
            margin: "0 0 2.25rem",
            maxWidth: "22rem",
          }}
        >
          Stop when you think time is up!
          <br />
          <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
            No peeking at the clock, Commander!&nbsp;👀
          </span>
        </p>

        {/* ── BIG PULSING STOP BUTTON ───────────────────── */}
        {/*
          Sizing: clamp(220px, 55vw, 280px)
            - On a 320px phone: 55vw = 176px → clamped up to 220px ✓
            - On a 390px phone: 55vw = 214px → clamped up to 220px ✓
            - On a 430px phone: 55vw = 236px → uses 236px ✓
            - On desktop: clamped to 280px ✓
          This keeps the button in the "giant but not absurd" zone on all devices.

          a11y:
          - type="button" prevents accidental form submission.
          - aria-label gives screen-reader context.
          - :focus-visible ring defined in globals.css.
        */}
        <button
          type="button"
          aria-label="Stop the timer"
          className="stop-btn-enter"
          onClick={handleStop}
          style={{
            width: "clamp(220px, 55vw, 280px)",
            height: "clamp(220px, 55vw, 280px)",
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
            outline: "none",
            // Remove tap highlight on Android Chrome
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <span
            style={{
              fontFamily: "'Orbitron', monospace",
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "clamp(2rem, 8vw, 2.75rem)",
              letterSpacing: "0.08em",
              lineHeight: 1,
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            STOP
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
              fontWeight: 700,
              marginTop: "0.4rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Time&apos;s up!
          </span>
        </button>

        {/* Hint chip */}
        <div
          className="card-slide-up delay-400"
          style={{
            background: "rgba(30,41,59,0.55)",
            border: "1px solid rgba(71,85,105,0.4)",
            borderRadius: 9999,
            padding: "0.4rem 1.1rem",
            backdropFilter: "blur(4px)",
          }}
        >
          <p
            style={{
              color: "#475569",
              fontSize: "0.75rem",
              fontWeight: 600,
              margin: 0,
              letterSpacing: "0.05em",
            }}
          >
            🤫 The clock is hidden — trust your instincts
          </p>
        </div>
      </div>
    </div>
  );
}
