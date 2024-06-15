import { createContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

import {
  SocketContextInterface,
  SocketProviderProps,
} from "../interfaces/common";
import { useAuth } from "@/hooks/auth";

export const SocketContext = createContext<SocketContextInterface | null>(null);

export const SocketContextProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn === false) return;
    const socket = io(import.meta.env.VITE_SOCKET_URI, {
      withCredentials: true,
    });
    setSocket(socket);

    return () => {
      socket.disconnect();
      setSocket(null);
    };
  }, [isLoggedIn]);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
