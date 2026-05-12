import { useState } from "react";

interface LandingProps {
  onJoin: (roomId: string, username: string) => void;
}

export default function Landing({ onJoin }: LandingProps) {
  const [username, setUsername] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [createdCode, setCreatedCode] = useState("");
  const [showCreated, setShowCreated] = useState(false);
  const [error, setError] = useState("");

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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        padding: "24px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          letterSpacing: "-1px",
          fontWeight: 400,
          marginBottom: "8px",
        }}
      >
        Echo
      </h1>
      <p style={{ color: "var(--text-dim)", marginBottom: "16px" }}>
        Where conversations resonate
      </p>

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
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          color: "var(--text)",
          padding: "12px 16px",
          fontSize: "13px",
          width: "260px",
          textAlign: "center",
        }}
      />

      {/* Create or Created */}
      {!showCreated && (
        <button
          onClick={handleCreate}
          style={{
            background: "var(--text)",
            color: "var(--bg)",
            padding: "12px 24px",
            fontSize: "13px",
          }}
        >
          create room
        </button>
      )}

      {showCreated && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            animation: "fadeUp 0.3s ease",
          }}
        >
          <div style={{ color: "var(--text-dim)", fontSize: "11px" }}>
            room code
          </div>
          <div
            style={{
              fontSize: "24px",
              letterSpacing: "4px",
              fontWeight: 600,
              userSelect: "all",
            }}
          >
            {createdCode}
          </div>
          <button
            onClick={() => onJoin(createdCode, username.trim())}
            style={{
              background: "var(--green)",
              color: "var(--bg)",
              padding: "10px 20px",
              fontSize: "12px",
            }}
          >
            enter room
          </button>
          <p style={{ color: "var(--text-mute)", fontSize: "11px" }}>
            share this with someone, then enter
          </p>
        </div>
      )}

      {/* Join */}
      {!showCreated && (
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <input
            type="text"
            placeholder="room code"
            value={joinCode}
            maxLength={6}
            onChange={(e) => {
              setJoinCode(e.target.value.toUpperCase());
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleJoin();
            }}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              padding: "12px 16px",
              fontSize: "13px",
              width: "160px",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          />
          <button
            onClick={handleJoin}
            style={{
              background: "var(--surface-2)",
              color: "var(--text)",
              padding: "12px 20px",
              fontSize: "13px",
              border: "1px solid var(--border)",
            }}
          >
            join
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            color: "var(--red)",
            fontSize: "12px",
            animation: "fadeUp 0.2s ease",
          }}
        >
          ⚠ {error}
        </div>
      )}

      <p
        style={{
          position: "absolute",
          bottom: "24px",
          color: "var(--text-mute)",
          fontSize: "11px",
        }}
      >
        rooms expire when all users disconnect
      </p>
    </div>
  );
}
