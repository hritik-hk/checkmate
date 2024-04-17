import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SocketContextProvider } from "./context/SocketContext.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <SocketContextProvider>
      <App />
    </SocketContextProvider>
  </AuthContextProvider>
);
