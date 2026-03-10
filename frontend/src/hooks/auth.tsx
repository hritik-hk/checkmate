import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const state = useContext(AuthContext);
  if (!state) {
    throw new Error("auth state is undefined");
  }

  return state;
};
