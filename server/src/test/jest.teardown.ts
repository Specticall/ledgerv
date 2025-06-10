import { prisma } from "../config/config";
import TestDataStore from "./utils/TestDataStore";

// Delete all data from the mock database after test finishes
export default async () => {
  await TestDataStore.clear();

  const deleteResources = prisma.resource.deleteMany();
  const deleteUserResources = prisma.userResource.deleteMany();
  const deleteFiles = prisma.file.deleteMany();
  const deleteFolders = prisma.folder.deleteMany();
  const deleteUsers = prisma.user.deleteMany();

  await prisma.$transaction([
    deleteUserResources,
    deleteFiles,
    deleteFolders,
    deleteResources,
    deleteUsers,
  ]);
  await prisma.$disconnect();
};
