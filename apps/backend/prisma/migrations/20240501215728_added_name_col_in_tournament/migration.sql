/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Tournament` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_name_key" ON "Tournament"("name");
