/*
  Warnings:

  - The values [PENDING] on the enum `ResumeStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `status` to the `positions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PositionStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- AlterEnum
BEGIN;
CREATE TYPE "ResumeStatus_new" AS ENUM ('DRAFT', 'PUBLISHED', 'PRIVATE');
ALTER TABLE "public"."resumes" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "resumes" ALTER COLUMN "status" TYPE "ResumeStatus_new" USING ("status"::text::"ResumeStatus_new");
ALTER TYPE "ResumeStatus" RENAME TO "ResumeStatus_old";
ALTER TYPE "ResumeStatus_new" RENAME TO "ResumeStatus";
DROP TYPE "public"."ResumeStatus_old";
ALTER TABLE "resumes" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterTable
ALTER TABLE "positions" ADD COLUMN     "status" "PositionStatus" NOT NULL;

-- AlterTable
ALTER TABLE "resumes" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
