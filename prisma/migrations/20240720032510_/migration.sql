/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `magic_links` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "magic_links_token_key" ON "magic_links"("token");
