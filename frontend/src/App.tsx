import { useState } from "react";
import Landing from "./components/Landing";
import ChatRoom from "./components/ChatRoom";
import { useChat } from "./hooks/UseChat";

const WS_URL = "ws://localhost:8080";

export default function App() {
  const [page, setPage] = useState<"landing" | "chat">("landing");
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const { messages, connected, userCount, joinRoom, sendMessage, disconnect } =
    useChat(WS_URL);

  function handleJoin(room: string, uname: string) {
    setRoomId(room);
    setUsername(uname);
    joinRoom(room, uname);
    setPage("chat");
  }

  function handleLeave() {
    disconnect();
    setRoomId("");
    setUsername("");
    setPage("landing");
  }

  if (page === "chat") {
    return (
      <ChatRoom
        roomId={roomId}
        username={username}
        messages={messages}
        connected={connected}
        userCount={userCount}
        onSend={sendMessage}
        onLeave={handleLeave}
      />
    );
  }

  return <Landing onJoin={handleJoin} />;
}
