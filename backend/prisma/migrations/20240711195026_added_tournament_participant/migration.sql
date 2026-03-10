/*
  Warnings:

  - You are about to drop the column `participants` on the `Tournament` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "participants";

-- CreateTable
CREATE TABLE "TournamentParticipant" (
    "userId" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,

    CONSTRAINT "TournamentParticipant_pkey" PRIMARY KEY ("userId","tournamentId")
);

-- AddForeignKey
ALTER TABLE "TournamentParticipant" ADD CONSTRAINT "TournamentParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentParticipant" ADD CONSTRAINT "TournamentParticipant_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
