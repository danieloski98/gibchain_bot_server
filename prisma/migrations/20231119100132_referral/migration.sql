/*
  Warnings:

  - Added the required column `referredUserId` to the `Referrals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Referrals" ADD COLUMN     "referredUserId" TEXT NOT NULL;
