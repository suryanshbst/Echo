import React, { useState } from "react";

interface LandingProps {
  onJoin: (roomId: string, username: string) => void;
}

// Generate a random 6-char room code like "X7KP2A"
function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function Landing({ onJoin }: LandingProps) {
  const [username, setUsername] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [createdCode, setCreatedCode] = useState("");
  const [showCreated, setShowCreated] = useState(false);
  const [error, setError] = useState("");

  function handleCreate() {
    if (username.trim() === "") {
      setError("enter a username first");
      return;
    }
    const code = generateRoomCode();
    setCreatedCode(code);
    setShowCreated(true);
    setError("");
  }

  function handleEnterCreatedRoom() {
    onJoin(createdCode, username.trim());
  }

  function handleJoin() {
    if (username.trim() === "") {
      setError("enter a username first");
      return;
    }
    if (joinCode.trim() === "") {
      setError("enter a room code");
      return;
    }
    onJoin(joinCode.trim().toUpperCase(), username.trim());
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "5px",
          }}
        >
          <span style={styles.greenDot} />
          <span style={styles.appName}>VOID</span>
        </div>
        <p style={styles.subtitle}>
          ephemeral rooms — no logs, no traces, no history
        </p>

        <div style={styles.divider} />

        {/* Username field */}
        <div style={{ marginBottom: "18px" }}>
          <label style={styles.label}>_ username</label>
          <input
            style={styles.input}
            type="text"
            placeholder="who are you"
            value={username}
            maxLength={20}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
          />
        </div>

        {/* Create Room button OR the created room box */}
        {showCreated === false && (
          <button style={styles.btnPrimary} onClick={handleCreate}>
            <span style={{ fontSize: "16px", fontWeight: "300" }}>+</span>{" "}
            Create New Room
          </button>
        )}

        {showCreated === true && (
          <div style={styles.createdBox}>
            <p style={styles.createdLabel}>room code</p>
            <p style={styles.createdCode}>{createdCode}</p>
            <p style={styles.createdHint}>
              share this with someone, then enter
            </p>
            <button style={styles.btnEnter} onClick={handleEnterCreatedRoom}>
              Enter Room →
            </button>
          </div>
        )}

        {/* Join Room row */}
        {showCreated === false && (
          <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
            <input
              style={styles.joinInput}
              type="text"
              placeholder="room code"
              value={joinCode}
              maxLength={8}
              onChange={(e) => {
                setJoinCode(e.target.value.toUpperCase());
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleJoin();
              }}
            />
            <button style={styles.btnJoin} onClick={handleJoin}>
              Join
            </button>
          </div>
        )}

        {/* Error message */}
        {error !== "" && (
          <p style={{ fontSize: "11px", color: "#f87171", marginTop: "10px" }}>
            ⚠ {error}
          </p>
        )}

        <p style={styles.footer}>rooms expire when all users disconnect</p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
  },
  card: {
    background: "#0f0f0f",
    border: "1px solid #242424",
    borderRadius: "2px",
    padding: "36px 40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 0 60px rgba(0,0,0,0.8)",
  },
  greenDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#4ade80",
    display: "inline-block",
  },
  appName: {
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "0.15em",
    color: "#ebebeb",
  },
  subtitle: {
    fontSize: "11px",
    color: "#555",
    letterSpacing: "0.02em",
  },
  divider: {
    height: "1px",
    background: "linear-gradient(90deg, #242424, transparent)",
    margin: "20px 0",
  },
  label: {
    display: "block",
    fontSize: "10px",
    color: "#555",
    letterSpacing: "0.08em",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    background: "#0a0a0a",
    border: "1px solid #242424",
    borderRadius: "2px",
    padding: "11px 14px",
    color: "#ebebeb",
    fontSize: "13px",
    fontFamily: "inherit",
  },
  btnPrimary: {
    width: "100%",
    background: "#ebebeb",
    color: "#080808",
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "0.06em",
    padding: "13px",
    borderRadius: "2px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "inherit",
  },
  createdBox: {
    background: "#0a0a0a",
    border: "1px solid #2e2e2e",
    borderRadius: "2px",
    padding: "20px",
    textAlign: "center",
    marginBottom: "10px",
  },
  createdLabel: {
    fontSize: "10px",
    color: "#555",
    letterSpacing: "0.1em",
    marginBottom: "10px",
  },
  createdCode: {
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "0.25em",
    color: "#ebebeb",
    marginBottom: "8px",
  },
  createdHint: {
    fontSize: "11px",
    color: "#444",
    marginBottom: "16px",
  },
  btnEnter: {
    background: "#4ade80",
    color: "#080808",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.05em",
    padding: "10px 24px",
    borderRadius: "2px",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  joinInput: {
    flex: 1,
    background: "#0a0a0a",
    border: "1px solid #242424",
    borderRadius: "2px",
    padding: "11px 14px",
    color: "#ebebeb",
    fontSize: "13px",
    fontFamily: "inherit",
    letterSpacing: "0.1em",
  },
  btnJoin: {
    background: "transparent",
    border: "1px solid #2e2e2e",
    borderRadius: "2px",
    padding: "11px 20px",
    color: "#ebebeb",
    fontSize: "12px",
    fontFamily: "inherit",
    cursor: "pointer",
  },
  footer: {
    marginTop: "24px",
    fontSize: "10px",
    color: "#333",
    textAlign: "center",
    letterSpacing: "0.04em",
  },
};
