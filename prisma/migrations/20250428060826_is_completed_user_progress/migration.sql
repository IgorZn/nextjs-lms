/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId]` on the table `Purchase` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserProgress" ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_userId_courseId_key" ON "Purchase"("userId", "courseId");
