import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);

// ── WebSocket Server ──
const wss = new WebSocketServer({ server });

interface User {
  socket: WebSocket;
  room: string;
  username: string;
}

let allSockets: User[] = [];

wss.on("connection", (socket) => {
  console.log("Someone connected");

  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message.toString());

    if (parsedMessage.type === "join") {
      const { roomId, username } = parsedMessage.payload;

      // Add user to tracking array
      allSockets.push({ socket, room: roomId, username });

      // Get all users in this specific room
      const roomUsers = allSockets.filter((u) => u.room === roomId);
      const roomUserCount = roomUsers.length;

      // Send confirmation to the user who just joined
      socket.send(
        JSON.stringify({
          type: "joined",
          payload: { roomId, username, userCount: roomUserCount },
        }),
      );

      // Broadcast to everyone ELSE in the room
      roomUsers.forEach((u) => {
        if (u.socket !== socket) {
          u.socket.send(
            JSON.stringify({
              type: "system",
              payload: {
                message: `${username} joined the room`,
                userCount: roomUserCount,
                timestamp: Date.now(),
              },
            }),
          );
        }
      });
    }

    if (parsedMessage.type === "chat") {
      // Find the user sending the message
      const currentUser = allSockets.find((u) => u.socket === socket);

      // If user isn't found (undefined), exit early
      if (!currentUser) return;

      // Broadcast message to everyone in their room
      allSockets.forEach((u) => {
        if (u.room === currentUser.room) {
          u.socket.send(
            JSON.stringify({
              type: "chat",
              payload: {
                message: parsedMessage.payload.message,
                username: currentUser.username,
                timestamp: Date.now(),
              },
            }),
          );
        }
      });
    }
  });

  socket.on("close", () => {
    // Find the user who is disconnecting
    const leftUser = allSockets.find((u) => u.socket === socket);

    // If not found, nothing to do
    if (!leftUser) return;

    // Remove them from the global array
    allSockets = allSockets.filter((u) => u.socket !== socket);

    // Calculate how many people are left in their room
    const roomUserCount = allSockets.filter(
      (u) => u.room === leftUser.room,
    ).length;

    // Notify everyone left in that room
    allSockets.forEach((u) => {
      if (u.room === leftUser.room) {
        u.socket.send(
          JSON.stringify({
            type: "system",
            payload: {
              message: `${leftUser.username} left the room`,
              userCount: roomUserCount,
              timestamp: Date.now(),
            },
          }),
        );
      }
    });
  });
});

// ── Serve Frontend ──
const frontendPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
