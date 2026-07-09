/*
  Warnings:

  - You are about to drop the column `name` on the `positions` table. All the data in the column will be lost.
  - Added the required column `description` to the `positions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `positions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "positions" DROP COLUMN "name",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AccessRule" (
    "id" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,

    CONSTRAINT "AccessRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PositionAttribute" (
    "id" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,

    CONSTRAINT "PositionAttribute_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccessRule" ADD CONSTRAINT "AccessRule_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionAttribute" ADD CONSTRAINT "PositionAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionAttribute" ADD CONSTRAINT "PositionAttribute_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
