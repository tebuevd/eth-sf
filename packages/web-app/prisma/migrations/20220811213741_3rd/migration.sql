/*
  Warnings:

  - Added the required column `tokenAddress` to the `airdrop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "airdrop" ADD COLUMN     "tokenAddress" CITEXT NOT NULL;
