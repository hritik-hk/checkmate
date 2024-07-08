import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addFriendship, declineFriendRequest } from "@/api/user";

export default function ActionCenter({ friendRequests }: any) {
  async function handleAccept(request: any) {
    await addFriendship({
      senderId: request.senderId,
      receiverId: request.receiverId,
    });
  }

  async function handleDecline(request: any) {
    await declineFriendRequest({
      senderId: request.senderId,
      receiverId: request.receiverId,
    });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="bg-white text-black p-1 md:p-2  rounded-lg">Actions</button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-stone-900">
        {friendRequests.length > 0 ? (
          <div>
            {friendRequests.map((request: any) => {
              return (
                <div className="my-3">
                  <span className="text-xl font-semibold mx-4">
                    {request.senderUsername}
                  </span>
                  <button
                    className="p-1 text-sm font-medium bg-green-500 rounded-md mr-2"
                    onClick={() => handleAccept(request)}
                  >
                    accept
                  </button>
                  <button
                    className="p-1 text-sm  bg-red-500 rounded-md"
                    onClick={() => handleDecline(request)}
                  >
                    decline
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-lg md:text-2xl">No Friend Requests...</div>
        )}
      </PopoverContent>
    </Popover>
  );
}
