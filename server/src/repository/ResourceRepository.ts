import { z } from "zod";
import { prisma } from "../config/config";
import { fileSchema, folderSchema } from "../utils/schemas";
import { Folder, Resource, File } from "@prisma/client";

const getAllResources = async () => {
  return prisma.resource.findMany();
};

const createFile = async (
  file: z.infer<typeof fileSchema>,
  trueOwnerId: number,
  parentResourceId?: string | null
) => {
  return prisma.resource.create({
    data: {
      trueOwnerId,
      type: file.resourceType,
      parentResourceId: parentResourceId,
      File: {
        create: {
          name: file.name,
          type: file.fileType,
          fileKey: file.fileKey,
          fileSizeMB: file.fileSizeMB,
        },
      },
    },
  });
};

const createFolder = async (
  folder: z.infer<typeof folderSchema>,
  trueOwnerId: number,
  parentResourceId?: string | null
) => {
  return prisma.resource.create({
    data: {
      trueOwnerId,
      type: folder.resourceType,
      parentResourceId: parentResourceId,
      Folder: {
        create: {
          name: folder.name,
        },
      },
    },
    include: {
      Folder: true,
    },
  });
};

// if parent id does not exist, it should grab all the root resources
const getAllFilesByParentId = async (parentId?: string) => {
  return prisma.resource.findMany({
    where: {
      parentResourceId: parentId,
    },
    include: {
      File: true,
    },
  });
};

// if parent id does not exist, it should grab all the root resources
const getAllFoldersByParentId = async (parentId?: string) => {
  return prisma.resource.findMany({
    where: {
      parentResourceId: parentId,
    },
    include: {
      Folder: true,
    },
  });
};

const deleteResourceById = async (resourceId: string) => {
  return prisma.resource.delete({
    where: {
      resourceId,
    },
  });
};

const getResourceById = async (resourceId: string) => {
  return prisma.resource.findUnique({
    where: {
      resourceId,
    },
  });
};

const getResourceWithDetailsById = async (resourceId: string) => {
  return prisma.resource.findUnique({
    where: {
      resourceId,
    },
    include: {
      File: true,
      Folder: true,
    },
  });
};

const updateManyResourceByIds = async (
  resourceIds: string[],
  newData: Partial<Resource>
) => {
  return prisma.resource.updateMany({
    where: {
      resourceId: {
        in: resourceIds,
      },
    },
    data: newData,
  });
};

const updateResourceById = async (
  resourceId: string,
  newData: Partial<Resource> & {
    File?: Partial<File>;
    Folder?: Partial<Folder>;
  }
) => {
  return prisma.resource.update({
    where: {
      resourceId,
    },
    data: {
      parentResourceId: newData.parentResourceId,
      // Update corresponding file / folder fields (if passed in)
      File: newData.File
        ? {
            update: {
              data: newData.File,
            },
          }
        : undefined,
      Folder: newData.Folder
        ? {
            update: {
              data: newData.Folder,
            },
          }
        : undefined,
    },
  });
};

const getStorageUsedByUserIdQuerySchema = z.array(
  z.object({
    sum: z
      .bigint()
      .transform((val) => Number(val))
      .or(z.null()),
  })
);
const getStorageUsedByUserId = async (userId: number): Promise<number> => {
  const result = await prisma.$queryRaw`
    SELECT SUM("fileSizeMB")
    FROM "UserResource" as ur
    JOIN "Resource" AS r ON ur."resourceId" = r."resourceId"
    JOIN "File" AS f ON f."resourceId" = r."resourceId"
    WHERE ur."userId" = ${userId}
  `;
  const parsedResult = getStorageUsedByUserIdQuerySchema.safeParse(result);
  if (parsedResult.error) {
    throw new Error("Invalid query return type shape");
  }
  return parsedResult.data[0].sum || 0;
};

export default {
  getAllResources,
  createFile,
  createFolder,
  getAllFilesByParentId,
  getAllFoldersByParentId,
  deleteResourceById,
  getResourceById,
  getResourceWithDetailsById,
  updateManyResourceByIds,
  updateResourceById,
  getStorageUsedByUserId,
};
