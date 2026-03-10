import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAuth } from "@/hooks/auth";

export default function TournamentsHistory({ tournamentHistory }: any) {
  const { authUser } = useAuth();

  return (
    <>
      {authUser && tournamentHistory && tournamentHistory.length > 0 && (
        <Table className="bg-stone-900">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tournamentHistory.map((item: any) => (
              <TableRow key={item.tournament.name}>
                <TableCell className="text-xs md:text-base md:font-medium">
                  {item.tournament.name}
                </TableCell>
                <TableCell>
                  {item.tournament.participants.map((player: any) => {
                    return <div>{player.user.username}</div>;
                  })}
                </TableCell>
                <TableCell className="w-fit">
                  {item.tournament.gameType}
                </TableCell>
                <TableCell className="text-xs md:text-base">
                  {" "}
                  {new Date(item.tournament.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
