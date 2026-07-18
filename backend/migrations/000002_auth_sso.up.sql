ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

ALTER TABLE "User" ADD COLUMN "provider" TEXT;
ALTER TABLE "User" ADD COLUMN "provider_subject" TEXT;
ALTER TABLE "User" ADD COLUMN "avatar_url" TEXT;

-- Same email may exist across providers; identity is (provider, provider_subject).
DROP INDEX IF EXISTS "User_email_key";
CREATE UNIQUE INDEX "User_email_provider_key"
  ON "User" ("email", "provider")
  WHERE "provider" IS NOT NULL;

CREATE UNIQUE INDEX "User_provider_provider_subject_key"
  ON "User" ("provider", "provider_subject")
  WHERE "provider" IS NOT NULL AND "provider_subject" IS NOT NULL;
