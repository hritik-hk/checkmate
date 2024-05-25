import { useState } from "react";
import { LuChevronsUpDown, LuCheck } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IFriend } from "@/interfaces/common";

export default function ChooseFriend({
  userFriends,
  participants,
  friendUsername,
  setFriendUsername,
}: {
  userFriends: IFriend[];
  participants?: string[];
  friendUsername: string;
  setFriendUsername: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [open, setOpen] = useState(false);

  function checked(username: string) {
    if (participants?.includes(username)) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between text-md"
        >
          Select Friend...
          <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search friend..." />
          <CommandEmpty>No matching friend</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {userFriends.map((friend) => (
                <CommandItem
                  key={friend.username}
                  value={friend.username}
                  onSelect={(currentValue) => {
                    setFriendUsername(
                      currentValue === friendUsername ? "" : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  <LuCheck
                    className={cn(
                      "mr-2 h-4 w-4",
                      participants === undefined
                        ? friendUsername === friend.username
                        : checked(friend.username)
                          ? "opacity-100"
                          : "opacity-0"
                    )}
                  />
                  {friend.username}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
