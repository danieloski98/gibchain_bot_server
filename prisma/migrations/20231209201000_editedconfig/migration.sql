-- AlterTable
ALTER TABLE "config" ADD COLUMN     "group_link" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
