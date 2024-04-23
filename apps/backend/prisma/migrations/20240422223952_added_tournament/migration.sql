-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "participants" TEXT[],

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);
