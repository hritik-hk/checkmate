-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "isGameOver" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "TournamentGame" ADD COLUMN     "isGameOver" BOOLEAN NOT NULL DEFAULT false;
