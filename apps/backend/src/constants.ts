export const ChatEvent = {
  CONNECTED_EVENT: "connected",

  DISCONNECT_EVENT: "disconnect",

  JOIN_ROOM_EVENT: "joinRoom",

  LEAVE_ROOM_EVENT: "leaveRoom",

  SOCKET_ERROR_EVENT: "socketError",
} as const;

export const GameEvent = {
  NEW_GAME_EVENT: "new-game",
  MOVE_UPDATE_EVENT: "move-update",
} as const;
