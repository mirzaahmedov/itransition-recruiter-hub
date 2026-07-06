-- CreateTable
CREATE TABLE "attribute_category" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attribute_category_pkey" PRIMARY KEY ("id")
);
