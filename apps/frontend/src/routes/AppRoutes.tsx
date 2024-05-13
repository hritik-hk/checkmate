import { Routes, Route } from "react-router-dom";

import Protected from "../components/Protected";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Game from "../pages/Game";
import Tournament from "@/pages/Tournament";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Protected>
            <Home />,
          </Protected>
        }
      />

      <Route
        path="/game/:gameId"
        element={
          <Protected>
            <Game />
          </Protected>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/tournament" element={<Tournament />} />

      <Route path="*" element={<h1 className="text-5xl">404 Not found</h1>} />
    </Routes>
  );
}
