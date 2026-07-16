/*
  Warnings:

  - You are about to drop the `attribute_values` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_profiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "attribute_values" DROP CONSTRAINT "attribute_values_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "attribute_values" DROP CONSTRAINT "attribute_values_choiceId_fkey";

-- DropForeignKey
ALTER TABLE "attribute_values" DROP CONSTRAINT "attribute_values_profileId_fkey";

-- DropForeignKey
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_userId_fkey";

-- DropTable
DROP TABLE "attribute_values";

-- DropTable
DROP TABLE "user_profiles";

-- CreateTable
CREATE TABLE "user_attributes" (
    "id" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "textValue" TEXT,
    "numberValue" DOUBLE PRECISION,
    "booleanValue" BOOLEAN,
    "dateValue" TIMESTAMP(3),
    "startDateValue" TIMESTAMP(3),
    "endDateValue" TIMESTAMP(3),
    "choiceId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "user_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_attributes_attributeId_userId_key" ON "user_attributes"("attributeId", "userId");

-- AddForeignKey
ALTER TABLE "user_attributes" ADD CONSTRAINT "user_attributes_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_attributes" ADD CONSTRAINT "user_attributes_choiceId_fkey" FOREIGN KEY ("choiceId") REFERENCES "attribute_choices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_attributes" ADD CONSTRAINT "user_attributes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
