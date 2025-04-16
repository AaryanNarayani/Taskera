/*
  Warnings:

  - You are about to drop the column `day` on the `UserAvailability` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `UserAvailability` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `UserAvailability` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UserAvailability` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `UserAvailability` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserAvailability_userId_day_key";

-- AlterTable
ALTER TABLE "UserAvailability" DROP COLUMN "day",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "fridayEndTime" TEXT,
ADD COLUMN     "fridayHours" DOUBLE PRECISION,
ADD COLUMN     "fridayStartTime" TEXT,
ADD COLUMN     "mondayEndTime" TEXT,
ADD COLUMN     "mondayHours" DOUBLE PRECISION,
ADD COLUMN     "mondayStartTime" TEXT,
ADD COLUMN     "saturdayEndTime" TEXT,
ADD COLUMN     "saturdayHours" DOUBLE PRECISION,
ADD COLUMN     "saturdayStartTime" TEXT,
ADD COLUMN     "sundayEndTime" TEXT,
ADD COLUMN     "sundayHours" DOUBLE PRECISION,
ADD COLUMN     "sundayStartTime" TEXT,
ADD COLUMN     "thursdayEndTime" TEXT,
ADD COLUMN     "thursdayHours" DOUBLE PRECISION,
ADD COLUMN     "thursdayStartTime" TEXT,
ADD COLUMN     "tuesdayEndTime" TEXT,
ADD COLUMN     "tuesdayHours" DOUBLE PRECISION,
ADD COLUMN     "tuesdayStartTime" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "wednesdayEndTime" TEXT,
ADD COLUMN     "wednesdayHours" DOUBLE PRECISION,
ADD COLUMN     "wednesdayStartTime" TEXT;

-- AlterTable
ALTER TABLE "_CourseToUser" ADD CONSTRAINT "_CourseToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CourseToUser_AB_unique";

-- AlterTable
ALTER TABLE "_GroupMembers" ADD CONSTRAINT "_GroupMembers_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_GroupMembers_AB_unique";

-- CreateIndex
CREATE UNIQUE INDEX "UserAvailability_userId_key" ON "UserAvailability"("userId");
