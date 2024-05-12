import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import tournament from "../assets/tournament.svg";

export function CreateTournament() {
  const navigate = useNavigate();

  const tags = Array.from({ length: 10 }).map((_, i) => `Friend ${i + 1}`);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-2xl text-white bg-neutral-800 hover:bg-neutral-600 font-md tracking-wide rounded-lg px-10 py-10">
          <span className="mr-3">
            <img className="w-14" src={tournament} alt="" />
          </span>
          Create Tournament
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tournament</DialogTitle>
          <DialogDescription>Add Participants To Tournament</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Tournament Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Participants
            </Label>
            <div>Displays select players</div>
            <ScrollArea className="h-72 w-48 rounded-md border">
              <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">
                  Friend List
                </h4>
                {tags.map((tag) => (
                  <>
                    <div key={tag} className="text-sm">
                      {tag}
                    </div>
                    <Separator className="my-2" />
                  </>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => navigate("/tournament/101")}>CREATE</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
