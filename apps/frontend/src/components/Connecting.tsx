import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import checkmate from "../assets/checkmate.jpg";
import { useSocket } from "@/hooks/socket";
import { useAuth } from "@/hooks/auth";

export default function Connecting({
  connecting,
  setConnecting,
}: {
  connecting: boolean;
  setConnecting: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { socket } = useSocket();
  const { authUser } = useAuth();

  function handleCancel() {
    setConnecting(false);
    if (authUser) {
      socket?.emit("CANCEL_RANDOM", authUser.id);
    }
  }

  return (
    <AlertDialog open={connecting}>
      <AlertDialogContent className="w-fit bg-stone-900">
        <AlertDialogHeader>
          <AlertDialogTitle>CONNECTING TO SOMEONE . . .</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex justify-center items-center">
          <img src={checkmate} className="w-80 rounded-lg" alt="waiting" />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
