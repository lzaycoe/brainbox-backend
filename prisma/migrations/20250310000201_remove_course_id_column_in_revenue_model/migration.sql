/*
  Warnings:

  - You are about to drop the column `courseId` on the `Revenue` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Revenue" DROP CONSTRAINT "Revenue_courseId_fkey";

-- AlterTable
ALTER TABLE "Revenue" DROP COLUMN "courseId";
