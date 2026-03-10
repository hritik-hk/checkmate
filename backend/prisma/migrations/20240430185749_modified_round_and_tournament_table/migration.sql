/*
  Warnings:

  - Added the required column `roundNumber` to the `Round` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRounds` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Round" ADD COLUMN     "roundNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "roundsOver" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalRounds" INTEGER NOT NULL;
