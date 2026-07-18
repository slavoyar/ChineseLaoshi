DROP INDEX IF EXISTS "User_provider_provider_subject_key";
DROP INDEX IF EXISTS "User_email_provider_key";
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

ALTER TABLE "User" DROP COLUMN IF EXISTS "avatar_url";
ALTER TABLE "User" DROP COLUMN IF EXISTS "provider_subject";
ALTER TABLE "User" DROP COLUMN IF EXISTS "provider";

UPDATE "User" SET "password" = '' WHERE "password" IS NULL;
ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;
