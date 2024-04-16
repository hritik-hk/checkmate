export const ChatEvent = {
  CONNECTED_EVENT: "connected",

  DISCONNECT_EVENT: "disconnect",

  JOIN_ROOM_EVENT: "joinRoom",

  LEAVE_ROOM_EVENT: "leaveRoom",

  SOCKET_ERROR_EVENT: "socketError",
} as const;
