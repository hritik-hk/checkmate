-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "isDraw" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "moves" TEXT[],
ADD COLUMN     "winnerId" TEXT;

-- CreateTable
CREATE TABLE "Points" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "point" INTEGER NOT NULL,

    CONSTRAINT "Points_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Points" ADD CONSTRAINT "Points_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
