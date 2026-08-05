ALTER TABLE "Card" ADD COLUMN "due" TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE "Card" ADD COLUMN "stability" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Card" ADD COLUMN "difficulty" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Card" ADD COLUMN "elapsedDays" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Card" ADD COLUMN "scheduledDays" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Card" ADD COLUMN "reps" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Card" ADD COLUMN "lapses" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Card" ADD COLUMN "state" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Card" ADD COLUMN "lastReview" TIMESTAMPTZ;

UPDATE "Card" SET
  "due" = NOW(),
  "stability" = 0,
  "difficulty" = 0,
  "elapsedDays" = 0,
  "scheduledDays" = 0,
  "reps" = 0,
  "lapses" = 0,
  "state" = 0,
  "lastReview" = NULL,
  "progress" = 0;

ALTER TABLE "Card" DROP COLUMN "step";
ALTER TABLE "Card" DROP COLUMN "isWinStreak";
ALTER TABLE "Card" DROP COLUMN "streak";

CREATE INDEX "Card_due_idx" ON "Card" ("due");
