import { useState, useRef, useEffect } from "react";
import type { Message } from "../hooks/UseChat";

interface ChatRoomProps {
  roomId: string;
  username: string;
  messages: Message[];
  connected: boolean;
  userCount: number;
  onSend: (text: string) => void;
  onLeave: () => void;
}

function getTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatRoom({
  roomId,
  messages,
  connected,
  userCount,
  onSend,
  onLeave,
}: ChatRoomProps) {
  const [inputText, setInputText] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const text = inputText.trim();
    if (!text) return;
    onSend(text);
    setInputText("");
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        position: "relative",
        zIndex: 1,
        background: "#050505",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          borderRight: "1px solid rgba(255,255,255,0.04)",
          padding: "32px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          flexShrink: 0,
          background: "#050505",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: 400,
            letterSpacing: "-0.5px",
            color: "#f0f0f0",
          }}
        >
          echo
        </div>

        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.04)",
            margin: "-4px 0",
          }}
        />

        <div>
          <div
            style={{
              color: "#444",
              fontSize: "10px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            room
          </div>
          <div
            style={{
              fontSize: "20px",
              letterSpacing: "3px",
              fontWeight: 600,
              color: "#f0f0f0",
              fontFamily: "var(--font-mono)",
            }}
          >
            {roomId}
          </div>
        </div>

        <div>
          <div
            style={{
              color: "#444",
              fontSize: "10px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            online
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#666",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: connected ? "#4ade80" : "#f87171",
                boxShadow: connected
                  ? "0 0 10px rgba(74, 222, 128, 0.35), 0 0 20px rgba(74, 222, 128, 0.1)"
                  : "0 0 10px rgba(248, 113, 113, 0.35), 0 0 20px rgba(248, 113, 113, 0.1)",
                transition: "all 0.4s ease",
              }}
            />
            {userCount} {userCount === 1 ? "user" : "users"}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={onLeave}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(248, 113, 113, 0.06)";
            e.currentTarget.style.borderColor = "rgba(248, 113, 113, 0.12)";
            e.currentTarget.style.color = "#ff8888";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
            e.currentTarget.style.color = "#f87171";
          }}
          style={{
            background: "transparent",
            color: "#f87171",
            padding: "14px",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.3px",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.06)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            width: "100%",
          }}
        >
          Leave Room
        </button>
      </aside>

      {/* Main Chat Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          background: "#050505",
        }}
      >
        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "32px 36px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {messages.length === 0 && (
            <div
              style={{
                margin: "auto",
                textAlign: "center",
                color: "#2a2a2a",
                animation: "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div
                style={{ fontSize: "36px", marginBottom: "20px", opacity: 0.4 }}
              >
                ◌
              </div>
              <div
                style={{
                  fontSize: "15px",
                  color: "#333",
                  marginBottom: "10px",
                }}
              >
                waiting for messages...
              </div>
              <div style={{ fontSize: "12px", color: "#222" }}>
                share code <strong style={{ color: "#444" }}>{roomId}</strong>{" "}
                to invite someone
              </div>
            </div>
          )}

          {messages.map((msg, index) => {
            if (msg.type === "system") {
              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    margin: "18px 0",
                    color: "#3a3a3a",
                    fontSize: "11px",
                    letterSpacing: "0.3px",
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  />
                  <span style={{ whiteSpace: "nowrap" }}>{msg.text}</span>
                  <span style={{ color: "#2a2a2a", fontSize: "10px" }}>
                    {getTime(msg.timestamp)}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  />
                </div>
              );
            }

            let showHeader = false;
            if (index === 0) showHeader = true;
            else if (messages[index - 1].type === "system") showHeader = true;
            else if (messages[index - 1].username !== msg.username)
              showHeader = true;

            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.isSelf ? "flex-end" : "flex-start",
                  maxWidth: "60%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "3px",
                  animation: "fadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {showHeader && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "8px",
                      marginTop: "12px",
                      marginBottom: "3px",
                      paddingLeft: msg.isSelf ? "0" : "4px",
                      paddingRight: msg.isSelf ? "4px" : "0",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: msg.isSelf ? "#4ade80" : "#777",
                        letterSpacing: "0.3px",
                      }}
                    >
                      {msg.isSelf ? "you" : msg.username}
                    </span>
                    <span style={{ fontSize: "10px", color: "#2a2a2a" }}>
                      {getTime(msg.timestamp)}
                    </span>
                  </div>
                )}
                <div
                  style={{
                    background: msg.isSelf
                      ? "rgba(74, 222, 128, 0.07)"
                      : "rgba(255,255,255,0.025)",
                    border: msg.isSelf
                      ? "1px solid rgba(74, 222, 128, 0.08)"
                      : "1px solid rgba(255,255,255,0.05)",
                    padding: "11px 17px",
                    borderRadius: msg.isSelf
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                    fontSize: "14px",
                    lineHeight: 1.55,
                    wordBreak: "break-word",
                    color: "#d5d5d5",
                    transition: "all 0.2s ease",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.04)",
            padding: "18px 36px",
            display: "flex",
            gap: "12px",
            background: "#050505",
          }}
        >
          <input
            type="text"
            placeholder="type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.02)",
              border: inputFocused
                ? "1px solid rgba(255,255,255,0.12)"
                : "1px solid rgba(255,255,255,0.05)",
              color: "#e8e8e8",
              padding: "14px 20px",
              fontSize: "14px",
              borderRadius: "14px",
              outline: "none",
              transition: "all 0.3s ease",
              boxShadow: inputFocused
                ? "0 0 0 3px rgba(255,255,255,0.025), inset 0 1px 0 rgba(255,255,255,0.02)"
                : "none",
            }}
          />
          <button
            onClick={handleSend}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 2px 8px rgba(255,255,255,0.03)";
            }}
            style={{
              background: "#f0f0f0",
              color: "#0a0a0a",
              padding: "14px 28px",
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: "0.3px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: "0 2px 8px rgba(255,255,255,0.03)",
            }}
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
}
