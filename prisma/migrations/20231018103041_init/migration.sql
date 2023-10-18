-- CreateEnum
CREATE TYPE "OTP_TYPE" AS ENUM ('VERIFICATION', 'WITHDRAWAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "telegram_username" TEXT NOT NULL,
    "telegram_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT NOT NULL,
    "referral" TEXT,
    "has_paid" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referrals" (
    "id" TEXT NOT NULL,
    "telegram_id" TEXT,

    CONSTRAINT "Referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Code" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "type" "OTP_TYPE" NOT NULL,
    "expired" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Code_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Referrals" ADD CONSTRAINT "Referrals_telegram_id_fkey" FOREIGN KEY ("telegram_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
