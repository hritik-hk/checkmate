/*
  Warnings:

  - Added the required column `receiverUsername` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderUsername` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FriendRequest" ADD COLUMN     "receiverUsername" TEXT NOT NULL,
ADD COLUMN     "senderUsername" TEXT NOT NULL;
