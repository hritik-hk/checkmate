import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./hooks/auth";
import { getUrl } from "./utils/helpers";

import Protected from "./components/Protected";
import Login from "./pages/Login";
import Home from "./pages/Login";
import Game from "./pages/Game";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <Home />,
      </Protected>
    ),
  },

  {
    path: "/newgame",
    element: (
      <Protected>
        <Game />,
      </Protected>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  const { isLoggedIn, setIsLoggedIn, setAuthUser } = useAuth();

  useEffect(() => {
    fetch(getUrl("auth/check"), {
      credentials: "include" as RequestCredentials,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`some went wrong error code: ${response.status}`);
        }
      })
      .then((respData) => {
        if (respData.token) {
          setIsLoggedIn(true);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, [setIsLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      fetch(getUrl("user/own"), {
        credentials: "include" as RequestCredentials,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(`some went wrong error code: ${response.status}`);
          }
        })
        .then((respData) => {
          setAuthUser(respData);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, [isLoggedIn, setAuthUser]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
