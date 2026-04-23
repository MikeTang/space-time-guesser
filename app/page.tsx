"use client";

import { useState } from "react";
import StarField from "./components/StarField";
import MissionSetup from "./components/MissionSetup";
import ActiveGuess from "./components/ActiveGuess";
import MissionReport from "./components/MissionReport";

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

  function handlePlayAgain() {
    setScreen("setup");
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

      {/* ── Screen 3: Mission Report ── */}
      {screen === "result" && (
        <MissionReport
          missionMinutes={missionMinutes}
          elapsedMs={elapsedMs}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </>
  );
}
