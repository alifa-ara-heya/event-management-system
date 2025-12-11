-- AlterTable
ALTER TABLE "hosts" ALTER COLUMN "interests" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "interests" SET DEFAULT ARRAY[]::TEXT[];
