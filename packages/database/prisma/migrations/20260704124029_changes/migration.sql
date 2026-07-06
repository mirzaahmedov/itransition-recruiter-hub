/*
  Warnings:

  - You are about to drop the column `booleanValue` on the `attributes` table. All the data in the column will be lost.
  - You are about to drop the column `dateValue` on the `attributes` table. All the data in the column will be lost.
  - You are about to drop the column `endDateValue` on the `attributes` table. All the data in the column will be lost.
  - You are about to drop the column `numberValue` on the `attributes` table. All the data in the column will be lost.
  - You are about to drop the column `startDateValue` on the `attributes` table. All the data in the column will be lost.
  - You are about to drop the column `textValue` on the `attributes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attributes" DROP COLUMN "booleanValue",
DROP COLUMN "dateValue",
DROP COLUMN "endDateValue",
DROP COLUMN "numberValue",
DROP COLUMN "startDateValue",
DROP COLUMN "textValue";

-- CreateTable
CREATE TABLE "attribute_values" (
    "id" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "textValue" TEXT,
    "numberValue" DOUBLE PRECISION,
    "booleanValue" BOOLEAN,
    "dateValue" TIMESTAMP(3),
    "startDateValue" TIMESTAMP(3),
    "endDateValue" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attribute_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cvs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "cvs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attribute_values_attributeId_cvId_key" ON "attribute_values"("attributeId", "cvId");

-- AddForeignKey
ALTER TABLE "attribute_values" ADD CONSTRAINT "attribute_values_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_values" ADD CONSTRAINT "attribute_values_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cvs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
