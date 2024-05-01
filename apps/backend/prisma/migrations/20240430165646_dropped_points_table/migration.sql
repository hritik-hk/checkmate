/*
  Warnings:

  - You are about to drop the `Points` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Points" DROP CONSTRAINT "Points_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "Points" DROP CONSTRAINT "Points_userId_fkey";

-- DropTable
DROP TABLE "Points";
