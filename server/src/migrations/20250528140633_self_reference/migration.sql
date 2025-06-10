/*
  Warnings:

  - You are about to drop the `UserResource` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[resourceId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resourceId]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `resourceId` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resourceId` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('file', 'folder');

-- DropForeignKey
ALTER TABLE "UserResource" DROP CONSTRAINT "UserResource_userId_fkey";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "resourceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "resourceId" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserResource";

-- CreateTable
CREATE TABLE "Resource" (
    "resourceId" TEXT NOT NULL,
    "parentResourceId" TEXT,
    "type" "ResourceType" NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("resourceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_resourceId_key" ON "File"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_resourceId_key" ON "Folder"("resourceId");

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_parentResourceId_fkey" FOREIGN KEY ("parentResourceId") REFERENCES "Resource"("resourceId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("resourceId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("resourceId") ON DELETE CASCADE ON UPDATE CASCADE;
