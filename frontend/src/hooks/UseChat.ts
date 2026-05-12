import { useEffect, useRef, useState } from "react";

// Shape of a single chat message
export interface Message {
  id: string;
  type: "chat" | "system";
  text: string;
  username: string;
  isSelf: boolean;
  timestamp: number;
}

export function useChat(wsUrl: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const myUsername = useRef<string>("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [userCount, setUserCount] = useState(0);

  // Connect to the server and join a room
  function joinRoom(roomId: string, username: string) {
    myUsername.current = username;

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { roomId, username },
        }),
      );
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "joined") {
        setConnected(true);
        setUserCount(msg.payload.userCount);

        // Add a system message so the user sees they joined
        const joinedMsg: Message = {
          id: crypto.randomUUID(),
          type: "system",
          text: "you joined room " + msg.payload.roomId,
          username: "",
          isSelf: false,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, joinedMsg]);
      }

      if (msg.type === "system") {
        setUserCount(msg.payload.userCount);

        const systemMsg: Message = {
          id: crypto.randomUUID(),
          type: "system",
          text: msg.payload.message,
          username: "",
          isSelf: false,
          timestamp: msg.payload.timestamp,
        };
        setMessages((prev) => [...prev, systemMsg]);
      }

      if (msg.type === "chat") {
        const isMe = msg.payload.username === myUsername.current;

        const chatMsg: Message = {
          id: crypto.randomUUID(),
          type: "chat",
          text: msg.payload.message,
          username: msg.payload.username,
          isSelf: isMe,
          timestamp: msg.payload.timestamp,
        };
        setMessages((prev) => [...prev, chatMsg]);
      }
    };

    ws.onclose = () => {
      setConnected(false);
    };
  }

  // Send a chat message to the server
  function sendMessage(text: string) {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: { message: text },
        }),
      );
    }
  }

  // Leave the room and clean up
  function disconnect() {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setConnected(false);
    setMessages([]);
    setUserCount(0);
  }

  // Close the socket if the component unmounts
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return { messages, connected, userCount, joinRoom, sendMessage, disconnect };
}
