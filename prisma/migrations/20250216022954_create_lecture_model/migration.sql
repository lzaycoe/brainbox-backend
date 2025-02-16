-- CreateEnum
CREATE TYPE "LectureType" AS ENUM ('video', 'file', 'link', 'text');

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Lecture" (
    "id" SERIAL NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "type" "LectureType" NOT NULL DEFAULT 'video',
    "note" TEXT,
    "attachments" TEXT[],
    "canPreview" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lecture_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
