import Navbar from "../components/Navbar";
import { getUserByUsername } from "../api/user";
import { createGame } from "../api/game";
import { useSocket } from "../hooks/socket";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { socket } = useSocket();
  const navigate = useNavigate();

  async function handleSearch(e: any) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const username = Object.fromEntries(formData) as { username: string };
    const opponentUser = await getUserByUsername(username);
    if (opponentUser) {
      const newGame = await createGame({ id: opponentUser.id });
      socket?.emit("play-online", newGame.game.id);
      localStorage.setItem("gameId", newGame.game.id);
      navigate("/newgame");
    }
  }

  return (
    <>
      <Navbar />
      <div className=" w-screen h-screen bg-slate-600 ">
        <div className=" w-1/2  pt-5">
          <h1 className="text-3xl text-gray-200">Find People to DM</h1>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                name="username"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="find opponents using username..."
                required
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
