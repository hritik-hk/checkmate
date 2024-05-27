/*
  Warnings:

  - The values [ABANDONED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "GameResult" ADD VALUE 'ABANDONED';

-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('IN_PROGRESS', 'COMPLETED');
ALTER TABLE "Game" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TABLE "Tournament" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TABLE "TournamentGame" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
COMMIT;
