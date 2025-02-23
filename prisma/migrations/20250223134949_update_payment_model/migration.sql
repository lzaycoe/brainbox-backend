/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `paymentUrl` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "paymentId",
DROP COLUMN "paymentUrl";
