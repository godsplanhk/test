/*
  Warnings:

  - You are about to alter the column `time_left` on the `social_media_logs` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("interval")` to `Integer`.

*/
-- AlterTable
ALTER TABLE "social_media_logs" ALTER COLUMN "time_left" SET DATA TYPE INTEGER;
