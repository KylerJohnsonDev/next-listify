/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "session_userId_key" ON "session"("userId");
