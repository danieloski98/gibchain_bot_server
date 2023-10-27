/*
  Warnings:

  - The values [waiting,confirming,sending,partially_paid,finished,refunded,expired] on the enum `PAYMENT_STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PAYMENT_STATUS_new" AS ENUM ('created', 'confirmed', 'failed', 'delayed', 'pending', 'resolved');
ALTER TABLE "Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PAYMENT_STATUS_new" USING ("status"::text::"PAYMENT_STATUS_new");
ALTER TYPE "PAYMENT_STATUS" RENAME TO "PAYMENT_STATUS_old";
ALTER TYPE "PAYMENT_STATUS_new" RENAME TO "PAYMENT_STATUS";
DROP TYPE "PAYMENT_STATUS_old";
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'created';
COMMIT;

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'created';

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_telegram_id_fkey" FOREIGN KEY ("telegram_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
