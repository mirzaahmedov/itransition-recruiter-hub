/*
  Warnings:

  - You are about to drop the `AccessRule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AccessRule" DROP CONSTRAINT "AccessRule_positionId_fkey";

-- DropForeignKey
ALTER TABLE "PositionAttribute" DROP CONSTRAINT "PositionAttribute_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "PositionAttribute" DROP CONSTRAINT "PositionAttribute_positionId_fkey";

-- DropTable
DROP TABLE "AccessRule";

-- CreateTable
CREATE TABLE "resume_likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "resume_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "resume_likes_userId_resumeId_key" ON "resume_likes"("userId", "resumeId");

-- AddForeignKey
ALTER TABLE "PositionAttribute" ADD CONSTRAINT "PositionAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionAttribute" ADD CONSTRAINT "PositionAttribute_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_likes" ADD CONSTRAINT "resume_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_likes" ADD CONSTRAINT "resume_likes_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
