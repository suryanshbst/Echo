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
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "200px",
          borderRight: "1px solid var(--border)",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: "18px", fontWeight: 500 }}>echo</div>
        <div style={{ color: "var(--text-dim)", fontSize: "11px" }}>room</div>
        <div
          style={{
            fontSize: "16px",
            letterSpacing: "2px",
            fontWeight: 600,
          }}
        >
          {roomId}
        </div>
        <div style={{ color: "var(--text-dim)", fontSize: "11px" }}>
          {userCount} online
        </div>
        <div
          style={{
            color: connected ? "var(--green)" : "var(--red)",
            fontSize: "11px",
          }}
        >
          {connected ? "● connected" : "○ disconnected"}
        </div>
        <button
          onClick={onLeave}
          style={{
            marginTop: "auto",
            background: "var(--surface-2)",
            color: "var(--red)",
            padding: "10px",
            fontSize: "12px",
            border: "1px solid var(--border)",
          }}
        >
          leave room
        </button>
      </aside>

      {/* Main Chat Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {messages.length === 0 && (
            <div
              style={{
                margin: "auto",
                textAlign: "center",
                color: "var(--text-mute)",
                animation: "fadeUp 0.5s ease",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>◌</div>
              <div style={{ fontSize: "13px" }}>waiting for messages...</div>
              <div style={{ fontSize: "11px", marginTop: "8px" }}>
                share code <strong>{roomId}</strong> to invite someone
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
                    gap: "12px",
                    margin: "12px 0",
                    color: "var(--text-mute)",
                    fontSize: "11px",
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "var(--border)",
                    }}
                  />
                  <span>{msg.text}</span>
                  <span>{getTime(msg.timestamp)}</span>
                  <span
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "var(--border)",
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
                  maxWidth: "70%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                {showHeader && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "8px",
                      marginTop: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: msg.isSelf ? "var(--green)" : "var(--text-dim)",
                      }}
                    >
                      {msg.isSelf ? "you" : msg.username}
                    </span>
                    <span
                      style={{ fontSize: "10px", color: "var(--text-mute)" }}
                    >
                      {getTime(msg.timestamp)}
                    </span>
                  </div>
                )}
                <div
                  style={{
                    background: msg.isSelf
                      ? "var(--surface-2)"
                      : "var(--surface)",
                    border: "1px solid var(--border)",
                    padding: "10px 14px",
                    borderRadius: "4px",
                    fontSize: "13px",
                    lineHeight: 1.5,
                    wordBreak: "break-word",
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
            borderTop: "1px solid var(--border)",
            padding: "16px 20px",
            display: "flex",
            gap: "12px",
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
            style={{
              flex: 1,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              padding: "12px 16px",
              fontSize: "13px",
            }}
          />
          <button
            onClick={handleSend}
            style={{
              background: "var(--text)",
              color: "var(--bg)",
              padding: "12px 20px",
              fontSize: "13px",
            }}
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
}
