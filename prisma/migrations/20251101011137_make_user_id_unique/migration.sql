/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `AccessRefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AccessRefreshToken_userId_key" ON "AccessRefreshToken"("userId");
