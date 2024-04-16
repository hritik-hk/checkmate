import { createContext, useState, ReactNode } from "react";
import { AuthContextInterface, authUserType } from "../interfaces/common";

const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthContextProvider = ({ children }: { children?: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authUser, setAuthUser] = useState<authUserType | null>(null);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        authUser,
        setAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
