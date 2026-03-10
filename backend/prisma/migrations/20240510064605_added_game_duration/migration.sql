/*
  Warnings:

  - Added the required column `gameDuration` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameDuration` to the `TournamentGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "gameDuration" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TournamentGame" ADD COLUMN     "gameDuration" INTEGER NOT NULL;
