import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
  username: string;
}

let allSockets: User[] = [];

wss.on("connection", (socket) => {
  console.log("someone connected");

  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message.toString());

    // ── User wants to JOIN a room ──────────────────────────
    if (parsedMessage.type === "join") {
      const roomId = parsedMessage.payload.roomId;
      const username = parsedMessage.payload.username;

      allSockets.push({ socket, room: roomId, username });

      // Count how many people are in the room now
      let roomUserCount = 0;
      for (let i = 0; i < allSockets.length; i++) {
        //@ts-ignore
        if (allSockets[i].room === roomId) {
          roomUserCount++;
        }
      }

      // Tell the person who just joined that they're in
      socket.send(
        JSON.stringify({
          type: "joined",
          payload: {
            roomId,
            username,
            userCount: roomUserCount,
          },
        }),
      );

      // Tell everyone ELSE in the room that someone joined
      for (let i = 0; i < allSockets.length; i++) {
        //@ts-ignore
        if (allSockets[i].room === roomId && allSockets[i].socket !== socket) {
          //@ts-ignore
          allSockets[i].socket.send(
            JSON.stringify({
              type: "system",
              payload: {
                message: username + " joined the room",
                userCount: roomUserCount,
                timestamp: Date.now(),
              },
            }),
          );
        }
      }

      console.log(username + " joined room " + roomId);
    }

    // ── User wants to SEND a chat message ──────────────────
    if (parsedMessage.type === "chat") {
      // First, find which room this socket belongs to
      let currentUserRoom = "";
      let currentUsername = "";

      for (let i = 0; i < allSockets.length; i++) {
        //@ts-ignore
        if (allSockets[i].socket === socket) {
          //@ts-ignore
          currentUserRoom = allSockets[i].room;
          //@ts-ignore
          currentUsername = allSockets[i].username;
        }
      }

      // Send the message to EVERYONE in the same room
      for (let i = 0; i < allSockets.length; i++) {
        //@ts-ignore
        if (allSockets[i].room === currentUserRoom) {
          //@ts-ignore
          allSockets[i].socket.send(
            JSON.stringify({
              type: "chat",
              payload: {
                message: parsedMessage.payload.message,
                username: currentUsername,
                timestamp: Date.now(),
              },
            }),
          );
        }
      }

      console.log(
        "[" +
          currentUserRoom +
          "] " +
          currentUsername +
          ": " +
          parsedMessage.payload.message,
      );
    }
  });

  // ── User DISCONNECTS ────────────────────────────────────────
  socket.on("close", () => {
    // Find the user who left
    let leftUser: User | null = null;

    for (let i = 0; i < allSockets.length; i++) {
      //@ts-ignore
      if (allSockets[i].socket === socket) {
        //@ts-ignore
        leftUser = allSockets[i];
        break;
      }
    }

    if (leftUser === null) return;

    // Remove them from the list
    let updatedSockets: User[] = [];
    for (let i = 0; i < allSockets.length; i++) {
      //@ts-ignore
      if (allSockets[i].socket !== socket) {
        //@ts-ignore
        updatedSockets.push(allSockets[i]);
      }
    }
    allSockets = updatedSockets;

    // Count remaining people in the room
    let roomUserCount = 0;
    for (let i = 0; i < allSockets.length; i++) {
      //@ts-ignore
      if (allSockets[i].room === leftUser.room) {
        roomUserCount++;
      }
    }

    // Tell everyone still in the room that this person left
    for (let i = 0; i < allSockets.length; i++) {
      //@ts-ignore
      if (allSockets[i].room === leftUser.room) {
        //@ts-ignore
        allSockets[i].socket.send(
          JSON.stringify({
            type: "system",
            payload: {
              message: leftUser.username + " left the room",
              userCount: roomUserCount,
              timestamp: Date.now(),
            },
          }),
        );
      }
    }

    console.log(leftUser.username + " disconnected from room " + leftUser.room);
  });
});

console.log("Server running on ws://localhost:8080");
