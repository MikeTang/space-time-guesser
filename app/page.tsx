"use client";

import { useState } from "react";
import StarField from "./components/StarField";
import MissionSetup from "./components/MissionSetup";
import ActiveGuess from "./components/ActiveGuess";

type Screen = "setup" | "guess" | "result";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [missionMinutes, setMissionMinutes] = useState<number>(1);
  // elapsedMs is set when the kid taps STOP; passed to Screen 3 for scoring.
  const [elapsedMs, setElapsedMs] = useState<number>(0);

  function handleLaunch(minutes: number) {
    setMissionMinutes(minutes);
    setScreen("guess");
  }

  function handleStop(ms: number) {
    setElapsedMs(ms);
    setScreen("result");
  }

  return (
    <>
      {/* Fixed background decorations — always rendered */}
      {/* Nebula blobs */}
      <div
        className="nebula"
        style={{
          width: 400,
          height: 400,
          background: "rgba(88,28,135,0.18)",
          top: -100,
          left: -100,
        }}
      />
      <div
        className="nebula"
        style={{
          width: 350,
          height: 350,
          background: "rgba(30,64,175,0.15)",
          bottom: 0,
          right: -80,
        }}
      />
      <div
        className="nebula"
        style={{
          width: 250,
          height: 250,
          background: "rgba(251,146,60,0.08)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      />

      {/* Twinkling star field */}
      <StarField />

      {/* ── Screen 1: Mission Setup ── */}
      {screen === "setup" && <MissionSetup onLaunch={handleLaunch} />}

      {/* ── Screen 2: Active Guess ── */}
      {screen === "guess" && (
        <ActiveGuess missionMinutes={missionMinutes} onStop={handleStop} />
      )}

      {/* ── Screen 3: Result (stub — next task) ── */}
      {screen === "result" && (
        <div
          style={{
            position: "relative",
            zIndex: 10,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontFamily: "'Nunito', sans-serif",
            gap: "1.5rem",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <p
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "1.25rem",
              color: "#fb923c",
            }}
          >
            📊 Mission Report
          </p>
          <p style={{ color: "#94a3b8" }}>
            Target: {missionMinutes * 60}s · You stopped at:{" "}
            {(elapsedMs / 1000).toFixed(1)}s
          </p>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
            Screen 3 coming soon…
          </p>
          <button
            onClick={() => setScreen("setup")}
            style={{
              padding: "0.75rem 2rem",
              borderRadius: "0.75rem",
              border: "1px solid #475569",
              background: "transparent",
              color: "#94a3b8",
              cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            ← Play Again
          </button>
        </div>
      )}
    </>
  );
}
