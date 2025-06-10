/*
  Warnings:

  - You are about to drop the column `userUserId` on the `UserResource` table. All the data in the column will be lost.
  - Added the required column `userId` to the `UserResource` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserResource" DROP CONSTRAINT "UserResource_userUserId_fkey";

-- AlterTable
ALTER TABLE "UserResource" DROP COLUMN "userUserId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserResource" ADD CONSTRAINT "UserResource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
