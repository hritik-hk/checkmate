-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "whitePlayerId" TEXT NOT NULL,
    "blackPlayerId" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);
