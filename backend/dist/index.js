import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
// ── CORS for Vercel frontend ──
app.use(cors({
    origin: "*", // or your Vercel domain later
}));
// ── WebSocket Server ──
const wss = new WebSocketServer({ server });
let allSockets = [];
wss.on("connection", (socket) => {
    console.log("someone connected");
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.type === "join") {
            const { roomId, username } = parsedMessage.payload;
            allSockets.push({ socket, room: roomId, username });
            // Count users in the room
            const roomUsers = allSockets.filter((u) => u.room === roomId);
            const roomUserCount = roomUsers.length;
            socket.send(JSON.stringify({
                type: "joined",
                payload: { roomId, username, userCount: roomUserCount },
            }));
            // Notify others in the room
            roomUsers.forEach((u) => {
                if (u.socket !== socket) {
                    u.socket.send(JSON.stringify({
                        type: "system",
                        payload: {
                            message: username + " joined the room",
                            userCount: roomUserCount,
                            timestamp: Date.now(),
                        },
                    }));
                }
            });
        }
        if (parsedMessage.type === "chat") {
            // Safely find the user using TypeScript-friendly .find()
            const currentUser = allSockets.find((u) => u.socket === socket);
            // If user isn't found, exit early (satisfies TS)
            if (!currentUser)
                return;
            // Broadcast message to their room
            allSockets.forEach((u) => {
                if (u.room === currentUser.room) {
                    u.socket.send(JSON.stringify({
                        type: "chat",
                        payload: {
                            message: parsedMessage.payload.message,
                            username: currentUser.username,
                            timestamp: Date.now(),
                        },
                    }));
                }
            });
        }
    });
    socket.on("close", () => {
        // Safely find the leaving user
        const leftUser = allSockets.find((u) => u.socket === socket);
        if (!leftUser)
            return;
        // Remove them from the global array
        allSockets = allSockets.filter((u) => u.socket !== socket);
        // Get the new count for that room
        const roomUserCount = allSockets.filter((u) => u.room === leftUser.room).length;
        // Notify remaining users
        allSockets.forEach((u) => {
            if (u.room === leftUser.room) {
                u.socket.send(JSON.stringify({
                    type: "system",
                    payload: {
                        message: leftUser.username + " left the room",
                        userCount: roomUserCount,
                        timestamp: Date.now(),
                    },
                }));
            }
        });
    });
});
// ── Health check for Render ──
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map