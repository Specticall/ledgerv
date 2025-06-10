/*
  Warnings:

  - Added the required column `permission` to the `UserResource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserResource" ADD COLUMN     "permission" "Permission" NOT NULL;
