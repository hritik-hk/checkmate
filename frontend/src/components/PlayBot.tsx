import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { FiCpu } from "react-icons/fi";

export default function PlayBot() {
  const navigate = useNavigate();

  return (
    <Button
      className="w-3/4 text-lg md:text-2xl text-white bg-stone-800 hover:bg-neutral-600 font-md tracking-wide rounded-lg p-7 md:p-10"
      onClick={() => navigate("/bot")}
    >
      <span className="mr-3">
        <FiCpu className="w-10 h-10 md:w-14 md:h-14" />
      </span>
      Play with Bot
    </Button>
  );
}
