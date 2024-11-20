/*
  Warnings:

  - A unique constraint covering the columns `[userId,day]` on the table `UserAvailability` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserAvailability_userId_day_key" ON "UserAvailability"("userId", "day");
