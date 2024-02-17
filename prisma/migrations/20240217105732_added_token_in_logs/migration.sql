/*
  Warnings:

  - You are about to drop the column `token` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `logs` ADD COLUMN `token` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `token`;
