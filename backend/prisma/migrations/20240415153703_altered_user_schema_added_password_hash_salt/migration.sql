/*
  Warnings:

  - Added the required column `password_hash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_salt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "password_salt" TEXT NOT NULL;
