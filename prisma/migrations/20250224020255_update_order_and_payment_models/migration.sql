/*
  Warnings:

  - You are about to drop the column `amount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Payment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_courseId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "amount",
ADD COLUMN     "courseIds" INTEGER[],
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
ALTER COLUMN "courseId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "amount";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
