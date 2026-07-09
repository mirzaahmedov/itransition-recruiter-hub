/*
  Warnings:

  - A unique constraint covering the columns `[attributeId,value]` on the table `attribute_choices` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "attribute_choices_attributeId_value_key" ON "attribute_choices"("attributeId", "value");
