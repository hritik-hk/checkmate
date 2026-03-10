/*
  Warnings:

  - You are about to drop the column `isDraw` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `isGameOver` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `roundsOver` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `totalRounds` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `isDraw` on the `TournamentGame` table. All the data in the column will be lost.
  - You are about to drop the column `isGameOver` on the `TournamentGame` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `TournamentGame` table. All the data in the column will be lost.
  - Added the required column `result` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `result` to the `TournamentGame` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GameResult" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED', 'DRAW', 'CHECKMATE', 'TIMES_UP');

-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "isDraw",
DROP COLUMN "isGameOver",
DROP COLUMN "status",
ADD COLUMN     "result" "GameResult" NOT NULL;

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "roundsOver",
DROP COLUMN "totalRounds",
ADD COLUMN     "status" "TournamentStatus" NOT NULL;

-- AlterTable
ALTER TABLE "TournamentGame" DROP COLUMN "isDraw",
DROP COLUMN "isGameOver",
DROP COLUMN "status",
ADD COLUMN     "result" "GameResult" NOT NULL;

-- DropEnum
DROP TYPE "GameStatus";
