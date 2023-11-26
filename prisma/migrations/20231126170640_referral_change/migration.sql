/*
  Warnings:

  - You are about to drop the column `telegram_id` on the `Referrals` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[telegram_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Referrals" DROP CONSTRAINT "Referrals_telegram_id_fkey";

-- AlterTable
ALTER TABLE "Referrals" DROP COLUMN "telegram_id",
ADD COLUMN     "referral_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_telegram_id_key" ON "User"("telegram_id");

-- AddForeignKey
ALTER TABLE "Referrals" ADD CONSTRAINT "Referrals_referral_id_fkey" FOREIGN KEY ("referral_id") REFERENCES "User"("telegram_id") ON DELETE SET NULL ON UPDATE CASCADE;
