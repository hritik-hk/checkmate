import { useEffect, useRef, useState } from "react";

const FUNNY_MESSAGES = [
  "Pretending to do something while the server wakes up.😏",
  "Poking the server with a stick… 🥢",
  "Untangling the ethernet cables… 🕸️",
  "Definitely not stuck. Probably.🤷",
  "If this takes too long, try staring at the progress bar harder.🙃",
  "Rewriting it in Rust… eventually 🦀"
];

const MAX_DURATION_MS = 60000;

interface ServerWakeUpProps {
  onReady: () => void;
}

export default function ServerWakeUp({ onReady }: ServerWakeUpProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [fading, setFading] = useState(false);
  const startRef = useRef(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick elapsed time every second
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startRef.current);
      setMsgIndex((i) => (i + 1) % FUNNY_MESSAGES.length);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Poll /health until it responds
  useEffect(() => {
    const baseUri = import.meta.env.VITE_SERVER_URI;
    const healthUrl = `${baseUri}/health`;

    const check = async () => {
      try {
        const res = await fetch(healthUrl, { cache: "no-store" });
        if (res.ok) {
          if (pollRef.current) clearInterval(pollRef.current);
          if (intervalRef.current) clearInterval(intervalRef.current);
          setFading(true);
          setTimeout(onReady, 700); // let fade animation finish
        }
      } catch {
        // server still asleep, keep polling
      }
    };

    check(); // fire immediately
    pollRef.current = setInterval(check, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [onReady]);

  const progress = Math.min((elapsed / MAX_DURATION_MS) * 100, 95); // cap at 95% until confirmed
  const elapsedSec = Math.floor(elapsed / 1000);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.7s ease",
        gap: "2rem",
        padding: "2rem",
      }}
    >
      {/* Chess SVG bouncing */}
      <div
        style={{
          animation: "kingBounce 1.2s ease-in-out infinite",
          fontSize: "5rem",
          filter: "drop-shadow(0 0 24px #7c6aff88)",
        }}
      >
        ♕
      </div>

      <div style={{ textAlign: "center", maxWidth: "480px" }}>
        <h1
          style={{
            color: "#e2e8f0",
            fontSize: "1.6rem",
            fontWeight: 700,
            margin: "0 0 0.5rem",
            letterSpacing: "-0.5px",
          }}
        >
          Server is waking up…
        </h1>

        {/* Rotating funny message */}
        <p
          key={msgIndex}
          style={{
            color: "#a78bfa",
            fontSize: "1.05rem",
            margin: "0 0 0.25rem",
            minHeight: "1.6em",
            animation: "msgFade 0.5s ease",
          }}
        >
          {FUNNY_MESSAGES[msgIndex]}
        </p>

        <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>
          (Free tier server spins down after inactivity — shouldn't take long!)
        </p>
      </div>

      {/* Progress bar + timer */}
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div
          style={{
            background: "#1e293b",
            borderRadius: "999px",
            height: "8px",
            overflow: "hidden",
            boxShadow: "0 0 0 1px #334155",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #7c3aed, #a78bfa, #7c3aed)",
              backgroundSize: "200% 100%",
              borderRadius: "999px",
              transition: "width 1s linear",
              animation: "shimmer 2s linear infinite",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0.5rem",
            color: "#475569",
            fontSize: "0.78rem",
          }}
        >
          <span>Elapsed: {elapsedSec}s</span>
          <span>Usually &lt; 60s</span>
        </div>
      </div>

      {/* Dots pulse */}
      <div style={{ display: "flex", gap: "8px" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#7c3aed",
              animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes kingBounce {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-16px) scale(1.08); }
        }
        @keyframes msgFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%            { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
