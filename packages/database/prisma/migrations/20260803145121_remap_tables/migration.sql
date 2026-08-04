/*
  Warnings:

  - You are about to drop the `PositionAttribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResumeProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[salesforceId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PositionAttribute" DROP CONSTRAINT "PositionAttribute_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "PositionAttribute" DROP CONSTRAINT "PositionAttribute_positionId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectTag" DROP CONSTRAINT "ProjectTag_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectTag" DROP CONSTRAINT "ProjectTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "ResumeProject" DROP CONSTRAINT "ResumeProject_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ResumeProject" DROP CONSTRAINT "ResumeProject_resumeId_fkey";

-- DropForeignKey
ALTER TABLE "resume_attributes" DROP CONSTRAINT "resume_attributes_positionAttributeId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "salesforceId" TEXT;

-- DropTable
DROP TABLE "PositionAttribute";

-- DropTable
DROP TABLE "ProjectTag";

-- DropTable
DROP TABLE "ResumeProject";

-- DropTable
DROP TABLE "Tag";

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_tags" (
    "id" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "position_attributes" (
    "id" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,

    CONSTRAINT "position_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_projects" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resume_projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_salesforceId_key" ON "users"("salesforceId");

-- AddForeignKey
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "position_attributes" ADD CONSTRAINT "position_attributes_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "position_attributes" ADD CONSTRAINT "position_attributes_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_attributes" ADD CONSTRAINT "resume_attributes_positionAttributeId_fkey" FOREIGN KEY ("positionAttributeId") REFERENCES "position_attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_projects" ADD CONSTRAINT "resume_projects_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_projects" ADD CONSTRAINT "resume_projects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
