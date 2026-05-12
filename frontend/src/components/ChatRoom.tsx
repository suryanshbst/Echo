import React, { useEffect, useRef, useState } from "react";
//@ts-ignore
import { Message } from "../hooks/UseChat";

interface ChatRoomProps {
  roomId: string;
  username: string;
  messages: Message[];
  userCount: number;
  connected: boolean;
  onSend: (text: string) => void;
  onLeave: () => void;
}

function getTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function ChatRoom({
  roomId,
  username,
  messages,
  userCount,
  connected,
  onSend,
  onLeave,
}: ChatRoomProps) {
  const [inputText, setInputText] = useState("");
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever a new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (inputText.trim() === "") return;
    if (connected === false) return;
    onSend(inputText.trim());
    setInputText("");
  }

  function handleCopyCode() {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div style={styles.wrapper}>
      {/* ── Sidebar ── */}
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.sideAppName}>VOID</div>

          {/* Room code */}
          <div style={styles.sideSection}>
            <div style={styles.sideLabel}>room</div>
            <div style={styles.sideRoomCode}>{roomId}</div>
            <button style={styles.copyBtn} onClick={handleCopyCode}>
              {copied ? "✓ copied" : "copy code"}
            </button>
          </div>

          {/* Username */}
          <div style={styles.sideSection}>
            <div style={styles.sideLabel}>you</div>
            <div style={styles.sideValue}>{username}</div>
          </div>

          {/* Online count */}
          <div style={styles.sideSection}>
            <div style={styles.sideLabel}>online</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  ...styles.dot,
                  background: connected ? "#4ade80" : "#f87171",
                }}
              />
              <span style={styles.sideValue}>
                {userCount} {userCount === 1 ? "user" : "users"}
              </span>
            </div>
          </div>
        </div>

        <button style={styles.leaveBtn} onClick={onLeave}>
          ← leave room
        </button>
      </aside>

      {/* ── Main Chat Area ── */}
      <main style={styles.main}>
        {/* Top bar */}
        <div style={styles.topbar}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={styles.topbarRoom}># {roomId}</span>
            <span style={styles.topbarUsers}>{userCount} online</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              fontSize: "10px",
              color: "#444",
            }}
          >
            <span
              style={{
                ...styles.dot,
                background: connected ? "#4ade80" : "#f87171",
              }}
            />
            {connected ? "connected" : "disconnected"}
          </div>
        </div>

        {/* Messages list */}
        <div style={styles.messagesList}>
          {messages.length === 0 && (
            <div style={styles.emptyState}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>◌</div>
              <div>waiting for messages...</div>
              <div
                style={{ fontSize: "11px", marginTop: "6px", color: "#2e2e2e" }}
              >
                share code{" "}
                <strong style={{ color: "#ebebeb" }}>{roomId}</strong> to invite
                someone
              </div>
            </div>
          )}

          {messages.map((msg, index) => {
            // System messages look like dividers
            if (msg.type === "system") {
              return (
                <div key={msg.id} style={styles.systemMsg}>
                  <span style={styles.systemLine} />
                  <span>{msg.text}</span>
                  <span style={styles.systemLine} />
                  <span style={{ fontSize: "9px", color: "#2e2e2e" }}>
                    {getTime(msg.timestamp)}
                  </span>
                </div>
              );
            }

            // Check if we should show the username header above this bubble
            // We only show it when it's the first message or the sender changed
            let showHeader = false;
            if (index === 0) {
              showHeader = true;
            } else if (messages[index - 1].type === "system") {
              showHeader = true;
            } else if (messages[index - 1].username !== msg.username) {
              showHeader = true;
            }

            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.isSelf ? "flex-end" : "flex-start",
                  marginTop: showHeader ? "18px" : "3px",
                  maxWidth: "68%",
                  alignSelf: msg.isSelf ? "flex-end" : "flex-start",
                }}
              >
                {/* Username + timestamp header */}
                {showHeader && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexDirection: msg.isSelf ? "row-reverse" : "row",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        color: msg.isSelf ? "#4ade80" : "#888",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {msg.isSelf ? "you" : msg.username}
                    </span>
                    <span style={{ fontSize: "9px", color: "#2e2e2e" }}>
                      {getTime(msg.timestamp)}
                    </span>
                  </div>
                )}

                {/* Message bubble */}
                <div
                  style={msg.isSelf ? styles.bubbleSelf : styles.bubbleOther}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div style={styles.inputBar}>
          <span
            style={{
              color: "#2e2e2e",
              fontSize: "14px",
              fontWeight: "600",
              userSelect: "none",
            }}
          >
            &gt;
          </span>
          <input
            style={styles.textInput}
            type="text"
            placeholder={connected ? "type a message..." : "reconnecting..."}
            value={inputText}
            disabled={!connected}
            autoFocus
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button
            style={{
              ...styles.sendBtn,
              opacity: inputText.trim() !== "" && connected ? 1 : 0.3,
            }}
            onClick={handleSend}
            disabled={inputText.trim() === "" || !connected}
          >
            send
          </button>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    position: "relative",
    zIndex: 1,
  },
  sidebar: {
    width: "220px",
    minWidth: "220px",
    background: "#0a0a0a",
    borderRight: "1px solid #1a1a1a",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "28px 20px",
  },
  sideAppName: {
    fontSize: "16px",
    fontWeight: "700",
    letterSpacing: "0.2em",
    color: "#ebebeb",
    marginBottom: "28px",
  },
  sideSection: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "22px",
  },
  sideLabel: {
    fontSize: "10px",
    color: "#3a3a3a",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  sideValue: {
    fontSize: "13px",
    color: "#888",
  },
  sideRoomCode: {
    fontSize: "20px",
    fontWeight: "700",
    letterSpacing: "0.22em",
    color: "#ebebeb",
  },
  copyBtn: {
    background: "transparent",
    border: "1px solid #222",
    borderRadius: "2px",
    color: "#444",
    fontSize: "10px",
    letterSpacing: "0.08em",
    padding: "5px 10px",
    fontFamily: "inherit",
    cursor: "pointer",
    width: "fit-content",
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    display: "inline-block",
    flexShrink: 0,
  },
  leaveBtn: {
    background: "transparent",
    border: "none",
    color: "#333",
    fontSize: "11px",
    fontFamily: "inherit",
    cursor: "pointer",
    letterSpacing: "0.05em",
    textAlign: "left",
    padding: "0",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    borderBottom: "1px solid #161616",
    flexShrink: 0,
  },
  topbarRoom: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#ebebeb",
    letterSpacing: "0.05em",
  },
  topbarUsers: {
    fontSize: "11px",
    color: "#3a3a3a",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    background: "#0d0d0d",
  },
  messagesList: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 28px",
    display: "flex",
    flexDirection: "column",
  },
  emptyState: {
    margin: "auto",
    textAlign: "center",
    color: "#2e2e2e",
    fontSize: "12px",
    letterSpacing: "0.06em",
    lineHeight: "2",
  },
  systemMsg: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    justifyContent: "center",
    fontSize: "10px",
    color: "#2e2e2e",
    letterSpacing: "0.06em",
    margin: "14px 0",
  },
  systemLine: {
    flex: 1,
    height: "1px",
    background: "#181818",
    display: "block",
  },
  bubbleSelf: {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "2px 2px 0 2px",
    padding: "10px 14px",
    color: "#ebebeb",
    fontSize: "13px",
    lineHeight: "1.5",
    wordBreak: "break-word",
  },
  bubbleOther: {
    background: "#0f0f0f",
    border: "1px solid #1e1e1e",
    borderRadius: "2px 2px 2px 0",
    padding: "10px 14px",
    color: "#aaa",
    fontSize: "13px",
    lineHeight: "1.5",
    wordBreak: "break-word",
  },
  inputBar: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 24px",
    borderTop: "1px solid #161616",
    background: "#0a0a0a",
    flexShrink: 0,
  },
  textInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "#ebebeb",
    fontSize: "13px",
    fontFamily: "inherit",
    caretColor: "#4ade80",
  },
  sendBtn: {
    background: "transparent",
    border: "1px solid #2e2e2e",
    borderRadius: "2px",
    color: "#888",
    fontSize: "11px",
    letterSpacing: "0.08em",
    padding: "7px 16px",
    fontFamily: "inherit",
    cursor: "pointer",
    flexShrink: 0,
  },
};
