/*
  Warnings:

  - You are about to drop the `cvs` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ResumeStatus" AS ENUM ('PENDING', 'PUBLISHED');

-- DropTable
DROP TABLE "cvs";

-- CreateTable
CREATE TABLE "resumes" (
    "id" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ResumeStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_attributes" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "positionAttributeId" TEXT NOT NULL,
    "userAttributeId" TEXT NOT NULL,

    CONSTRAINT "resume_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "resumes_userId_positionId_key" ON "resumes"("userId", "positionId");

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_attributes" ADD CONSTRAINT "resume_attributes_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_attributes" ADD CONSTRAINT "resume_attributes_positionAttributeId_fkey" FOREIGN KEY ("positionAttributeId") REFERENCES "PositionAttribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_attributes" ADD CONSTRAINT "resume_attributes_userAttributeId_fkey" FOREIGN KEY ("userAttributeId") REFERENCES "user_attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
