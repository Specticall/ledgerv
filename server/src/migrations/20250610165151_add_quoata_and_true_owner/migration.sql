/*
  Warnings:

  - Added the required column `trueOwnerId` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "trueOwnerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "maxStorageQuotaMB" INTEGER NOT NULL DEFAULT 1000;
