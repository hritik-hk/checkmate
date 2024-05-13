import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SocketContextProvider } from "./context/SocketContext.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { GameContextProvider } from "./context/GameContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <BrowserRouter>
      <AuthContextProvider>
        <SocketContextProvider>
          <GameContextProvider>
            <App />
          </GameContextProvider>
        </SocketContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </ThemeProvider>
);
