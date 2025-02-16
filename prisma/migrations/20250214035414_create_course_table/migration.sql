-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "tag" TEXT,
    "status" "CourseStatus" NOT NULL DEFAULT 'pending',
    "teacherId" INTEGER,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);
