export const ChatEvent = {
    CONNECTED_EVENT: "connected",
  
    DISCONNECT_EVENT: "disconnect",
  
    JOIN_ROOM_EVENT: "joinRoom",
  
    LEAVE_ROOM_EVENT: "leaveRoom",
  
    SOCKET_ERROR_EVENT: "socketError",
  } as const;
  
  export const GameEvent = {
    NEW_GAME_EVENT: "new_game",
    START_GAME: "start_game",
    GAME_REQUEST: "game_request",
    INIT_GAME: "init_game",
    MOVE_UPDATE_EVENT: "move_update",
  } as const;
  