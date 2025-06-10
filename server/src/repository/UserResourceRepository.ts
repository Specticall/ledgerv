import { Permission } from "@prisma/client";
import { prisma } from "../config/config";

const createUserResource = async (userId: number, resourceId: string) => {
  return prisma.userResource.create({
    data: {
      userId,
      resourceId,
    },
  });
};

const createOwnerUserResource = async (
  userId: number,
  resourceId: string,
  permission: Permission
) => {
  return prisma.userResource.create({
    data: {
      userId,
      resourceId,
      permission,
    },
  });
};

/**
 * Retrieves all files owned by a certain user and a certain parent
 * @param userId owner resource id
 * @param parentId Resource parent's id
 */
const getUserFilesByParentId = async (userId: number, parentId?: string) => {
  return prisma.userResource.findMany({
    where: {
      userId,
      Resource: {
        type: "file",
        parentResourceId: parentId || null,
      },
    },
    include: {
      Resource: {
        include: {
          File: true,
        },
      },
    },
  });
};

/**
 * Retrieves all folders owned by a certain user and a certain parent
 * @param userId owner resource id
 * @param parentId Resource parent's id
 */
const getUserFoldersByParentId = async (userId: number, parentId?: string) => {
  return prisma.userResource.findMany({
    where: {
      userId,
      Resource: {
        type: "folder",
        parentResourceId: parentId || null,
      },
    },
    include: {
      Resource: {
        include: {
          Folder: true,
        },
      },
    },
  });
};

const getUserResourceByUserAndResourceId = async (
  userId: number,
  resourceId: string
) => {
  return prisma.userResource.findFirst({
    where: {
      userId,
      resourceId,
    },
  });
};

const getManyUserResourceByUserAndResourceId = async (
  userId: number,
  resourceId: string[]
) => {
  return prisma.userResource.findMany({
    where: {
      userId,
      resourceId: {
        in: resourceId,
      },
    },
  });
};

export default {
  createUserResource,
  createOwnerUserResource,
  getUserFilesByParentId,
  getUserFoldersByParentId,
  getUserResourceByUserAndResourceId,
  getManyUserResourceByUserAndResourceId,
};
