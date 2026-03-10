-- CreateTable
CREATE TABLE "FriendRequest" (
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("senderId","receiverId")
);
