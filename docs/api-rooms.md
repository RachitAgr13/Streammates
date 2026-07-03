# Room API (M2)

Base URL: `/api/rooms`

## POST /api/rooms

Create a guest room. No authentication required.

**Rate limit:** 10 requests per 15 minutes per IP.

### Request body

```json
{
  "name": "Friday Movie Night",
  "nickname": "Alex",
  "videoType": "youtube",
  "videoSource": "https://youtube.com/watch?v=dQw4w9WgXcQ"
}
```

| Field         | Type   | Required | Description                          |
| ------------- | ------ | -------- | ------------------------------------ |
| name          | string | yes      | 2–80 characters                      |
| nickname      | string | yes      | 2–30 chars, alphanumeric + `_-`     |
| videoType     | string | no       | `youtube` or `local`                 |
| videoSource   | string | no       | YouTube URL or 11-char video ID      |

### Response `201`

```json
{
  "success": true,
  "data": {
    "room": { "id": "...", "roomCode": "ABC123", "name": "...", "members": [...] },
    "guestId": "uuid",
    "inviteLink": "http://localhost:5173/room/ABC123"
  }
}
```

---

## GET /api/rooms/:code

Fetch room details by 6-character code.

### Response `200`

```json
{
  "success": true,
  "data": {
    "room": { "roomCode": "ABC123", "name": "...", "memberCount": 2, "members": [...] }
  }
}
```

### Errors

| Status | Message                    |
| ------ | -------------------------- |
| 404    | Room not found             |
| 410    | Room expired or inactive   |
| 503    | Database unavailable       |

---

## POST /api/rooms/:code/join

Join a room as a guest.

### Request body

```json
{
  "nickname": "Sam",
  "guestId": "optional-uuid-for-rejoin"
}
```

### Response `200`

```json
{
  "success": true,
  "data": {
    "room": { ... },
    "guestId": "uuid",
    "member": { "guestId": "uuid", "nickname": "Sam", "role": "guest" }
  }
}
```

### Errors

| Status | Message                         |
| ------ | ------------------------------- |
| 403    | Room full / banned              |
| 404    | Room not found                  |
| 410    | Room expired                    |
