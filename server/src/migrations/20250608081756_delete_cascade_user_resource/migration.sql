-- DropForeignKey
ALTER TABLE "UserResource" DROP CONSTRAINT "UserResource_resourceId_fkey";

-- AddForeignKey
ALTER TABLE "UserResource" ADD CONSTRAINT "UserResource_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("resourceId") ON DELETE CASCADE ON UPDATE CASCADE;
