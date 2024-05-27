/*
  Warnings:

  - The values [IN_PROGRESS,COMPLETED,ABANDONED] on the enum `GameResult` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `status` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Tournament` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `status` to the `TournamentGame` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- AlterEnum
BEGIN;
CREATE TYPE "GameResult_new" AS ENUM ('DRAW', 'CHECKMATE', 'TIMES_UP');
ALTER TABLE "Game" ALTER COLUMN "result" TYPE "GameResult_new" USING ("result"::text::"GameResult_new");
ALTER TABLE "TournamentGame" ALTER COLUMN "result" TYPE "GameResult_new" USING ("result"::text::"GameResult_new");
ALTER TYPE "GameResult" RENAME TO "GameResult_old";
ALTER TYPE "GameResult_new" RENAME TO "GameResult";
DROP TYPE "GameResult_old";
COMMIT;

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "status" "Status" NOT NULL;

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL;

-- AlterTable
ALTER TABLE "TournamentGame" ADD COLUMN     "status" "Status" NOT NULL;

-- DropEnum
DROP TYPE "TournamentStatus";
