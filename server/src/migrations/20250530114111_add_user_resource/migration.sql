-- CreateTable
CREATE TABLE "UserResource" (
    "userResourceId" SERIAL NOT NULL,
    "userUserId" INTEGER NOT NULL,
    "resourceId" TEXT NOT NULL,

    CONSTRAINT "UserResource_pkey" PRIMARY KEY ("userResourceId")
);

-- AddForeignKey
ALTER TABLE "UserResource" ADD CONSTRAINT "UserResource_userUserId_fkey" FOREIGN KEY ("userUserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResource" ADD CONSTRAINT "UserResource_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("resourceId") ON DELETE RESTRICT ON UPDATE CASCADE;
