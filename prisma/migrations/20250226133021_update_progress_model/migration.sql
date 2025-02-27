/*
  Warnings:

  - You are about to drop the column `lectures` on the `Progress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Progress" DROP COLUMN "lectures",
ADD COLUMN     "completedLectures" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "courseProgress" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "sectionProgress" JSONB;
