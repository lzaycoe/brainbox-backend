-- CreateEnum
CREATE TYPE "Role" AS ENUM ('learner', 'teacher');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'learner';
