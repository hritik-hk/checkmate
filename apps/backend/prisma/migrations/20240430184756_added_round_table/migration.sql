-- CreateTable
CREATE TABLE "Round" (
    "tournamentId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "startTime" BIGINT NOT NULL,
    "endTime" BIGINT NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("tournamentId","gameId")
);

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
