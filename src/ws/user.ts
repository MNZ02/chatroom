const userConnections = new Map<string, WebSocket>();

export function addUser(userId: string, ws: WebSocket) {
  userConnections.set(userId, ws);
}

export function removeUser(userId: string) {
  userConnections.delete(userId);
}
