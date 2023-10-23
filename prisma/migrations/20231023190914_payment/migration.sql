-- CreateEnum
CREATE TYPE "PAYMENT_STATUS" AS ENUM ('waiting', 'confirming', 'confirmed', 'sending', 'partially_paid', 'finished', 'failed', 'refunded', 'expired');

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "telegram_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "status" "PAYMENT_STATUS" NOT NULL DEFAULT 'waiting',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
