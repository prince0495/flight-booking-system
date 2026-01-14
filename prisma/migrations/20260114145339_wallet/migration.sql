/*
  Warnings:

  - Added the required column `amount` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "amount" INTEGER NOT NULL;
