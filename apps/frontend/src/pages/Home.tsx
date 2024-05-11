import { getUserByUsername } from "../api/user";
import { startRandomGame } from "../api/game";
import { useSocket } from "../hooks/socket";
import { GameEvent } from "../utils/constant";
import Navbar from "@/components/Navbar";
import { CreateTournament } from "@/components/CreateTournament";

export default function Home() {
  const { socket } = useSocket();

  async function handleSearch(e: any) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData) as {
      username: string;
      gameType: string;
      gameDuration: string;
    };
    console.log(data);
    const opponentUser = await getUserByUsername(data.username);
    if (opponentUser) {
      socket?.emit(GameEvent.GAME_REQUEST, opponentUser.id, data);
    }
  }

  async function handleRandomGame() {
    try {
      await startRandomGame();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Navbar />
      <div className=" w-screen h-screen bg-stone-700 ">
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
              <input
                type="text"
                name="gameType"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="tell game type"
                required
              />
              <input
                type="text"
                name="gameDuration"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="tell game duration in ms"
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
        <div className="mt-5 ml-2">
          <button
            className="text-white bg-green-700 hover:bg-green-500 font-medium rounded-lg text-lg px-4 py-2"
            onClick={handleRandomGame}
          >
            Play with Someone online
          </button>
        </div>
        <CreateTournament />
      </div>
    </>
  );
}
