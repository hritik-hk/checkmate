import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { logout } from "@/api/user";
import { useAuth } from "@/hooks/auth";
import { useSocket } from "@/hooks/socket";

export default function Logout() {
  const [loggedOut, setLoggedOut] = useState(false);
  const { setIsLoggedIn, setAuthUser, isLoggedIn } = useAuth();
  const { socket, setSocket } = useSocket();

  // delete token from user browser
  // disconnect socket connection from server
  useEffect(() => {
    async function logoutAsync() {
      const result = await logout();
      setLoggedOut(result);
    }
    logoutAsync();
  }, []);

  useEffect(() => {
    if (loggedOut && socket) {
      socket.disconnect();
      setSocket(null);
      setIsLoggedIn(false);
      setAuthUser(null);
    }
  }, [loggedOut]);

  return (
    <>
      {/* useEffect will run after render if we dont put condition here 
        it will navigate to '/login' route witout signing out */}
      {isLoggedIn == false && <Navigate to="/login" replace={true} />}
    </>
  );
}
