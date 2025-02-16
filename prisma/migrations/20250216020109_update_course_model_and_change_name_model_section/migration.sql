/*
  Warnings:

  - You are about to drop the column `price` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_courseId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "price",
ADD COLUMN     "originPrice" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
ADD COLUMN     "salePrice" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
ADD COLUMN     "subtitle" TEXT;

-- DropTable
DROP TABLE "Session";

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
