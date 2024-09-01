/*
  Warnings:

  - You are about to drop the column `guessRatio` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `writeCount` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `writeRatio` on the `Card` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "guessRatio",
DROP COLUMN "writeCount",
DROP COLUMN "writeRatio",
ADD COLUMN     "isWinStreak" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "step" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
ADD COLUMN     "streak" INTEGER NOT NULL DEFAULT 0;
