-- CreateTable
CREATE TABLE "feedback" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ipfs_hash" TEXT NOT NULL,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);
