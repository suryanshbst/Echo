import { useState } from "react";

interface LandingProps {
  onJoin: (roomId: string, username: string) => void;
}

function ChatIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default function Landing({ onJoin }: LandingProps) {
  const [username, setUsername] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [createdCode, setCreatedCode] = useState("");
  const [showCreated, setShowCreated] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  function generateCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  function handleCreate() {
    if (!username.trim()) {
      setError("enter a username first");
      return;
    }
    const code = generateCode();
    setCreatedCode(code);
    setShowCreated(true);
    setError("");
  }

  function handleJoin() {
    if (!username.trim()) {
      setError("enter a username first");
      return;
    }
    if (!joinCode.trim()) {
      setError("enter a room code");
      return;
    }
    onJoin(joinCode.trim().toUpperCase(), username.trim());
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "rgba(255,255,255,0.015)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "28px",
          padding: "36px 32px",
          backdropFilter: "blur(24px)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.02), 0 32px 64px -16px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          animation: "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#c0c0c0",
              }}
            >
              <ChatIcon />
            </div>
            <h1
              style={{
                fontSize: "20px",
                fontWeight: 500,
                letterSpacing: "-0.2px",
                color: "#f0f0f0",
              }}
            >
              Real Time Chat
            </h1>
          </div>
          <p
            style={{
              color: "#444",
              fontSize: "13px",
              letterSpacing: "0.2px",
            }}
          >
            Where conversations resonate
          </p>
        </div>

        {/* Username */}
        <input
          type="text"
          placeholder="username"
          value={username}
          maxLength={20}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
          onFocus={() => setFocused("username")}
          onBlur={() => setFocused(null)}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.025)",
            border:
              focused === "username"
                ? "1px solid rgba(255,255,255,0.12)"
                : "1px solid rgba(255,255,255,0.05)",
            color: "#e0e0e0",
            padding: "14px 20px",
            fontSize: "14px",
            borderRadius: "16px",
            outline: "none",
            transition: "all 0.3s ease",
          }}
        />

        {/* Create Room Button */}
        {!showCreated && (
          <button
            onClick={handleCreate}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
            style={{
              width: "100%",
              background: "#e8e8e8",
              color: "#0a0a0a",
              padding: "14px 24px",
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: "0.3px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            Create New Room
          </button>
        )}

        {/* Created Room Display */}
        {showCreated && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "14px",
              padding: "24px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.05)",
              animation: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div
              style={{
                color: "#444",
                fontSize: "10px",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              room code
            </div>
            <div
              style={{
                fontSize: "26px",
                letterSpacing: "5px",
                fontWeight: 600,
                color: "#f0f0f0",
                fontFamily: "var(--font-mono)",
                userSelect: "all",
              }}
            >
              {createdCode}
            </div>
            <button
              onClick={() => onJoin(createdCode, username.trim())}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(74,222,128,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              style={{
                width: "100%",
                background: "#4ade80",
                color: "#0a0a0a",
                padding: "13px 20px",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.3px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              Enter Room
            </button>
            <p
              style={{
                color: "#3a3a3a",
                fontSize: "11px",
                textAlign: "center",
              }}
            >
              share this code with someone, then enter
            </p>
          </div>
        )}

        {/* Join Room Row */}
        {!showCreated && (
          <div style={{ display: "flex", gap: "10px", width: "100%" }}>
            <input
              type="text"
              placeholder="Enter Room Code"
              value={joinCode}
              maxLength={6}
              onChange={(e) => {
                setJoinCode(e.target.value.toUpperCase());
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleJoin();
              }}
              onFocus={() => setFocused("join")}
              onBlur={() => setFocused(null)}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.025)",
                border:
                  focused === "join"
                    ? "1px solid rgba(255,255,255,0.12)"
                    : "1px solid rgba(255,255,255,0.05)",
                color: "#e0e0e0",
                padding: "14px 20px",
                fontSize: "14px",
                borderRadius: "16px",
                outline: "none",
                transition: "all 0.3s ease",
                minWidth: 0,
              }}
            />
            <button
              onClick={handleJoin}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              style={{
                background: "#e8e8e8",
                color: "#0a0a0a",
                padding: "14px 26px",
                fontSize: "14px",
                fontWeight: 500,
                letterSpacing: "0.3px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Join Room
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              color: "#f87171",
              fontSize: "12px",
              animation: "fadeUp 0.25s ease",
              padding: "10px 14px",
              background: "rgba(248, 113, 113, 0.04)",
              borderRadius: "12px",
              border: "1px solid rgba(248, 113, 113, 0.07)",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Footer */}
      <p
        style={{
          position: "absolute",
          bottom: "28px",
          color: "#222",
          fontSize: "11px",
          letterSpacing: "0.5px",
        }}
      >
        rooms expire when all users disconnect
      </p>
    </div>
  );
}
