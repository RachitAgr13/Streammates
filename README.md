# StreamMates

Real-time watch party platform — watch YouTube videos and synchronize local video playback with friends.

## Tech Stack

| Layer    | Technologies                                      |
| -------- | ------------------------------------------------- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, Zustand, Framer Motion, Socket.IO Client |
| Backend  | Node.js, Express, TypeScript, Socket.IO, Mongoose |
| Database | MongoDB Atlas                                     |
| Deploy   | Vercel (client), Render (server)                  |

## Project Structure

```
StreamMates/
├── client/          # React frontend (Vite)
├── server/          # Express + Socket.IO backend
├── docs/            # Architecture & API docs (coming soon)
└── package.json     # npm workspaces root
```

## Prerequisites

- **Node.js** 20+
- **npm** 10+ (included with Node)
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/RachitAgr13/Streammates.git
cd StreamMates
npm install
```

### 2. Environment variables

```bash
# Server
cp server/.env.example server/.env

# Client
cp client/.env.example client/.env
```

Edit `server/.env` and set `MONGODB_URI` to your MongoDB connection string.

### 3. Run development servers

```bash
npm run dev
```

This starts both:

- **Client** → http://localhost:5173
- **Server** → http://localhost:5000

Health check: http://localhost:5000/api/health

### Individual commands

```bash
npm run dev:client    # Frontend only
npm run dev:server    # Backend only
npm run build         # Build both packages
npm run lint          # Lint both packages
```

## Development Milestones

| Milestone | Status | Description                          |
| --------- | ------ | ------------------------------------ |
| M0        | ✅     | Architecture & planning              |
| M1        | ✅     | Project scaffold + landing page      |
| M2        | ✅     | Guest rooms (REST API)               |
| M3        | ✅     | Real-time presence (WebSockets)      |
| M4        | ✅     | YouTube playback sync                |
| M5        | ⬜     | Chat + reactions                     |
| M6        | ⬜     | Room permissions                     |
| M7        | ⬜     | Authentication (JWT)                 |
| M8+       | ⬜     | User features, local video, deploy   |

## License

MIT
