-- CreateTable
CREATE TABLE "position_integration_api_keys" (
    "id" TEXT NOT NULL,
    "hashToken" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "position_integration_api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "position_integration_api_keys_hashToken_key" ON "position_integration_api_keys"("hashToken");

-- AddForeignKey
ALTER TABLE "position_integration_api_keys" ADD CONSTRAINT "position_integration_api_keys_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
