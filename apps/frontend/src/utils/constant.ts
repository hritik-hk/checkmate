export const SocketEvent = {
  CONNECTED_EVENT: "connected",

  DISCONNECT_EVENT: "disconnect",

  JOIN_ROOM_EVENT: "joinRoom",

  LEAVE_ROOM_EVENT: "leaveRoom",

  SOCKET_ERROR_EVENT: "socketError",
} as const;

export const GameEvent = {
  NEW_GAME_EVENT: "NEW_GAME",
  START_GAME: "START_GAME",
  GAME_REQUEST: "GAME_REQUEST",
  INIT_GAME: "INIT_GAME",
  MOVE_UPDATE_EVENT: "MOVE_UPDATE_EVENT",
  JOIN_GAME: "JOIN_GAME",
  END_GAME: "END_GAME",
} as const;

export const TournamentEvent = {
  INIT_TOURNAMENT: "INIT_TOURNAMENT",
  START_TOURNAMENT: "START_TOURNAMENT",
  JOIN_TOURNAMENT: "JOIN_TOURNAMENT",
  ROUND_UPDATE: "ROUND_UPDATE",
} as const;

export const FriendEvent = {
  FRIEND_REQUEST: "FRIEND_REQUEST",
};
