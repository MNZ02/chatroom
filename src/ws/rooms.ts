import { WebSocketServer } from "ws";

const rooms = new Map<string, Set<string>>();

export function handleJoinRoom(room: string, userId: string) {
  if (!rooms.has(room)) {
    rooms.set(room, new Set());
  }
  rooms.get(room)?.add(userId);
}

export function handleRemoveRoom(room: string, userId: string) {
  rooms.get(room)?.delete(userId);

  if (rooms.get(room)?.size === 0) {
    rooms.delete(room);
  }
}

export function broadcastToRoom(
  wss: WebSocketServer,
  room: string,
  message: string,
  senderId: string
) {
  const participants = rooms.get(room);

  if (!participants) return;

  for (const participant of participants) {
    if (participant === senderId) continue;

    const client = Array.from(wss.clients).find(
      (ws) => (ws as any).id === participant
    );

    if (client && client.readyState === client.OPEN) {
      client.send(JSON.stringify({ sender: senderId, message: message }));
    }
  }
}
