/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `assist_users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "assist_users_email_key" ON "assist_users"("email");
