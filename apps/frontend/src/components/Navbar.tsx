import { Link } from "react-router-dom";
import checkmateLogo from "../assets/checkmateLogo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";

export default function Navbar() {
  const [search, setSearch] = useState<string>("");

  function handleSearch() {
    console.log(search);
    setSearch("");
  }

  return (
    <>
      <nav className="bg-stone-900 text-white">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-2">
          <div>
            <img src={checkmateLogo} className="h-16" alt="checkmate Logo" />
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
              <div className="mx-4 bg-white text-black p-2 rounded-md">
                <Link to="/" className=" py-2 px-3rounded">
                  Home
                </Link>
              </div>
              <div className="bg-white text-black p-2 rounded-md">
                <Link to="/user" className=" py-2 px-3 rounded">
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
