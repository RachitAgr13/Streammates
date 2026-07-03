# WebSocket Events (M3)

Socket.IO connects to the same server as the REST API (default: `http://localhost:5000`).

## Connection

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling'],
});
```

Guests must join a room via REST first, then connect the socket with their `guestId`.

---

## Client → Server

### `room:join`

Join the real-time room channel after REST membership exists.

```json
{
  "roomCode": "ABC123",
  "guestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Server validates:**
- Payload shape (Zod)
- Room exists and is active
- `guestId` is a registered member (not banned)

**Side effects:**
- Socket joins channel `room:ABC123`
- If same `guestId` is already connected elsewhere, old socket is disconnected
- Presence tracked in memory

### `room:leave`

Explicitly leave the room channel (also fired on disconnect cleanup).

---

## Server → Client

### `room:joined`

Sent to the connecting client after successful join.

```json
{
  "roomCode": "ABC123",
  "member": { "guestId": "...", "nickname": "Alex", "role": "host" },
  "onlineGuestIds": ["...", "..."]
}
```

### `presence:sync`

Full list of currently online guest IDs in the room.

```json
{ "onlineGuestIds": ["id1", "id2"] }
```

### `room:members-sync`

Full member list from database — broadcast when anyone connects so all clients stay in sync.

```json
{
  "members": [{ "guestId": "...", "nickname": "Alex", "role": "host", "joinedAt": "..." }],
  "memberCount": 2
}
```

### `member:online`

Another member connected their socket.

```json
{ "guestId": "...", "nickname": "Sam", "role": "guest" }
```

### `member:offline`

A member disconnected their socket.

```json
{ "guestId": "..." }
```

### `room:error`

```json
{ "message": "You are not a member of this room" }
```

---

## Presence vs Membership

| Concept | Stored in | Meaning |
|---------|-----------|---------|
| **Member** | MongoDB | Joined the room via REST (persistent) |
| **Online** | Server memory | Currently connected via WebSocket |

A member can be offline (closed tab) but still listed in the room.

---

## Race Conditions Handled

1. **Duplicate tabs** — Same `guestId` disconnects the previous socket
2. **REST join before socket** — Socket join validates against DB membership
3. **Stale member list** — `room:members-sync` refreshes from DB on every connect
