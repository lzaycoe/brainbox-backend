-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "revenueCalculated" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Revenue" (
    "id" SERIAL NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "totalRevenue" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "serviceFee" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "netRevenue" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Revenue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Revenue" ADD CONSTRAINT "Revenue_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revenue" ADD CONSTRAINT "Revenue_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
