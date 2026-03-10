import { Link } from "react-router-dom";
import checkmateLogo from "../assets/checkmateLogo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserByUsername } from "@/api/user";
import ActionCenter from "./ActionCenter";
import { useAuth } from "@/hooks/auth";
import { getFriendRequests } from "@/api/user";
import { LuLogOut } from "react-icons/lu";

export default function Navbar() {
  const navigate = useNavigate();
  const { authUser } = useAuth();

  const [search, setSearch] = useState<string>(""); // username to search
  const [requests, setRequests] = useState([]);

  async function handleSearch() {
    const user = await getUserByUsername(search);

    if (user === null) {
      // ToDo: show message on frontend using toast
      console.log("invalid user");
    } else {
      navigate(`/user/${user.username}`);
    }

    setSearch("");
  }

  useEffect(() => {
    async function fetchFriendRequests() {
      const data = await getFriendRequests();
      setRequests(data);
    }

    if (authUser) {
      fetchFriendRequests();
    }
  }, [authUser]);

  return (
    <>
      <nav className="bg-stone-900 text-white">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-2">
          <div>
            <Link to="/">
              <img src={checkmateLogo} className="h-12 sm:h-16" alt="checkmate Logo" />
            </Link>
          </div>
          <div className="w-full md:block md:w-auto">
            <div className=" flex items-center font-medium rounded-lg">
              <div className="relative">
                <Input
                  className="h-12 text-md"
                  placeholder="Search friends"
                  value={search}
                  onChange={(e: any) => setSearch(e.target.value)}
                ></Input>
                <div className="absolute end-2.5 bottom-1.5">
                  <Button className="px-4" onClick={handleSearch}>
                    <FaSearch />
                  </Button>
                </div>
              </div>
              <div className="hidden sm:block mx-4 bg-white text-black p-2 rounded-md">
                <Link to="/" className=" py-2 px-3rounded">
                  Home
                </Link>
              </div>

              <div className="mr-4">
                <ActionCenter friendRequests={requests} />
              </div>

              <div className="hidden sm:block bg-white text-black p-2  rounded-md">
                <Link to="/logout" className="py-2 px-3 rounded">
                  Logout
                </Link>
              </div>
              <div className="sm:hidden bg-white text-black p-2 rounded-md">
                <Link to="/logout">
                  <LuLogOut />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
