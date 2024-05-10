import { createContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

import {
  SocketContextInterface,
  SocketProviderProps,
} from "../interfaces/common";

export const SocketContext = createContext<SocketContextInterface | null>(null);

export const SocketContextProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URI, {
      withCredentials: true,
    });
    setSocket(socket);

    return () => {
      socket.disconnect();
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
