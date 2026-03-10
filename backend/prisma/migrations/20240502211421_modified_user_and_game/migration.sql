/*
  Warnings:

  - You are about to drop the column `rating` on the `User` table. All the data in the column will be lost.
  - Added the required column `gameType` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameType` to the `TournamentGame` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('RAPID', 'BLITZ');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "gameType" "GameType" NOT NULL;

-- AlterTable
ALTER TABLE "TournamentGame" ADD COLUMN     "gameType" "GameType" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "rating",
ADD COLUMN     "blitz_rating" INTEGER NOT NULL DEFAULT 800,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "rapid_rating" INTEGER NOT NULL DEFAULT 800;

-- CreateTable
CREATE TABLE "_friends" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_friends_AB_unique" ON "_friends"("A", "B");

-- CreateIndex
CREATE INDEX "_friends_B_index" ON "_friends"("B");

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
