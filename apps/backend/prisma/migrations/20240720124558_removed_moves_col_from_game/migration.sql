/*
  Warnings:

  - You are about to drop the column `moves` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `moves` on the `TournamentGame` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "moves";

-- AlterTable
ALTER TABLE "TournamentGame" DROP COLUMN "moves";
