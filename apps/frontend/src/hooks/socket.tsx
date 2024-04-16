import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) {
    throw new Error("socket state is undefined");
  }

  return state;
};
