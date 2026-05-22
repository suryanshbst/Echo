<div align="center">
  <h1>◌ Echo</h1>
  <p><em>ephemeral chat rooms. no history. no clutter.</em></p>
  <p>
    <a href="https://echo-8nu4.onrender.com"><img src="https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render&logoColor=white" alt="Render"></a>
    <img src="https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
    <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  </p>
</div>

---

## ✦ What is Echo?

**Echo** is a minimal, real-time chat application built for private, temporary conversations. Designed with a focus on simplicity and privacy, Echo leaves no trace behind.

- **Frictionless:** Create a room with one click. No accounts or passwords required.
- **Accessible:** Share the 6-character code, and anyone can instantly join.
- **Ephemeral:** Absolutely no persistent database. Once the last person leaves the room, the chat history vanishes forever.

> *"Where conversations resonate — then fade away."*

---

## ✦ Features

- ⚡ **Real-Time Messaging:** Powered by raw WebSockets (`ws`) for ultra-low latency communication.
- 🔒 **Private Rooms:** Unique, randomly generated 6-character alphanumeric room codes.
- 👤 **Live Presence Indicator:** Real-time online user count and system notifications for when users join or leave.
- 🌙 **Dark Aesthetic UI:** A sleek, noise-textured, and completely custom minimalist UI.
- 🗑️ **Memory-Safe Auto-Cleanup:** Rooms and arrays are automatically cleaned from memory when clients disconnect.
- 📱 **Responsive Design:** Fully fluid UI that scales beautifully from desktop monitors to mobile screens.

---

## ✦ Tech Stack

The project is structured as a full-stack monorepo with distinct frontend and backend architectures.

| Layer | Technology | Description |
|-------|------------|-------------|
| **Frontend** | React 19 + TypeScript + Vite | Handles the UI, state routing, and WebSocket client hooks. |
| **Styling** | Native CSS + Inline Styles | Custom variables, keyframe animations, and a global noise overlay. |
| **Backend** | Node.js + Express + `ws` | Minimalist HTTP server with an attached WebSocket instance. |
| **Deployment**| Render & Vercel | Seamless CI/CD hosting setups. |

---

## ✦ Quick Start (Local Development)

Follow these steps to get a local instance of Echo up and running.

### 1. Clone the Repository
```bash
git clone [https://github.com/suryanshbst/Echo.git](https://github.com/suryanshbst/Echo.git)
cd Echo
```
2. Start the Backend Server
The backend handles room states and message broadcasting.
```
cd backend
npm install
npm run build
npm run dev
The WebSocket server will start listening on ws://localhost:8080.
```
3. Start the Frontend Client
Open a new terminal window/tab:
```
cd frontend
npm install
npm run dev
The Vite dev server will launch on http://localhost:5173. Open this URL in two different browser tabs to test the real-time chat functionality!
```
 ## ✦ Project Architecture
```
Echo/
├── backend/
│   ├── src/
│   │   └── index.ts          # Express setup + WebSocket connection & broadcasting logic
│   ├── package.json
│   └── tsconfig.json         # Strict NodeNext TypeScript configuration
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Landing.tsx   # UI for username input and room generation/joining
│   │   │   └── ChatRoom.tsx  # Main chat interface with auto-scrolling
│   │   ├── hooks/
│   │   │   └── UseChat.ts    # Custom React Hook managing WebSocket lifecycle & state
│   │   ├── App.tsx           # Main application state and view router
│   │   └── index.css         # Global variables, animations, and dark noise styling
│   ├── package.json
│   └── vite.config.ts
└── README.md
```
## ✦ Internal WebSocket Protocol
Echo communicates using a standardized JSON payload structure over the WebSocket connection.

1. Client Join Request
```
{ 
  "type": "join", 
  "payload": { "roomId": "ABC123", "username": "alex" } 
}
```
2. Standard Chat Message
```
{ 
  "type": "chat", 
  "payload": { "message": "hello world" } 
}
```
3. Server System Broadcast (Presence)
```
{ 
  "type": "system", 
  "payload": { 
    "message": "alex joined the room", 
    "userCount": 2, 
    "timestamp": 1718291032 
  } 
}
```
## ✦ License & Credits
Released under the MIT License.
Built by @suryanshbst.
