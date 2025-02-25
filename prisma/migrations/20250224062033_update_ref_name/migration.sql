/*
  Warnings:

  - You are about to drop the column `courseIds` on the `Order` table. All the data in the column will be lost.
  - Made the column `courseId` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_courseId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "courseIds",
ALTER COLUMN "courseId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
