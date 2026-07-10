/*
  Warnings:

  - You are about to drop the column `cvId` on the `attribute_values` table. All the data in the column will be lost.
  - You are about to drop the `attribute_category` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[attributeId,profileId]` on the table `attribute_values` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "attribute_values" DROP CONSTRAINT "attribute_values_cvId_fkey";

-- DropForeignKey
ALTER TABLE "attributes" DROP CONSTRAINT "attributes_categoryId_fkey";

-- DropIndex
DROP INDEX "attribute_values_attributeId_cvId_key";

-- AlterTable
ALTER TABLE "attribute_values" DROP COLUMN "cvId",
ADD COLUMN     "choiceId" TEXT;

-- DropTable
DROP TABLE "attribute_category";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attribute_values_attributeId_profileId_key" ON "attribute_values"("attributeId", "profileId");

-- AddForeignKey
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_values" ADD CONSTRAINT "attribute_values_choiceId_fkey" FOREIGN KEY ("choiceId") REFERENCES "attribute_choices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
