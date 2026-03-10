/*
  Warnings:

  - You are about to drop the column `name` on the `Tournament` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Tournament_name_key";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "name";
