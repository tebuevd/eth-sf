CREATE EXTENSION IF NOT EXISTS citext;

-- CreateTable
CREATE TABLE "airdrop" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "distributionJson" JSONB NOT NULL,
    "adminAddress" CITEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "onchainId" TEXT NOT NULL,
    "isMinted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "airdrop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "airdrop_onchainId_key" ON "airdrop"("onchainId");
