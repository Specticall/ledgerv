import { RequestHandler } from "express";
import { z } from "zod";
import { validateSchema } from "../utils/validateSchema";
import { resourceSchema } from "../utils/schemas";
import { ResourceService } from "../service";
import { AppError } from "../utils/http/AppError";
import { STATUS } from "../utils/http/statusCodes";
import { $Enums, FileType, ResourceType } from "@prisma/client";

$Enums.FileType;

const getAllResourceBodySchema = z.object({
  parentResourceId: z.string().optional(),
});
const getAllResources: RequestHandler = async (request, response, next) => {
  try {
    const { parentResourceId } = validateSchema(
      getAllResourceBodySchema,
      request.query
    );

    const userId = request.userData?.id;
    if (!userId) {
      throw new AppError("User not authenticated", STATUS.UNAUTHORIZED);
    }

    const { folders, files } = await ResourceService.getAllUserResources(
      userId,
      parentResourceId
    );

    const formattedFolders = folders.map((folder) => {
      return {
        resourceId: folder.resourceId,
        parentResourceId: folder.Resource.parentResourceId,
        type: folder.Resource.type,
        name: folder.Resource.Folder?.name,
        createdAt: folder.Resource.Folder?.createdAt,
      };
    });

    const formattedFiles = files.map((file) => {
      return {
        resourceId: file.resourceId,
        parentResourceId: file.Resource.parentResourceId,
        type: file.Resource.type,
        name: file.Resource.File?.name,
        fileKey: file.Resource.File?.fileKey,
        fileType: file.Resource.File?.type,
        fileSizeMB: file.Resource.File?.fileSizeMB,
        createdAt: file.Resource.File?.createdAt,
      };
    });

    response.send({
      message: "Successfully retrieved all resources",
      data: {
        folders: formattedFolders,
        files: formattedFiles,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createResourceSchema = z.object({
  parentResourceId: z.string().optional(),
  resource: resourceSchema,
});
const createResource: RequestHandler = async (request, response, next) => {
  try {
    const { resource, parentResourceId } = validateSchema(
      createResourceSchema,
      request.body
    );

    const userId = request.userData?.id;
    if (!userId) {
      throw new AppError("User not authorized", STATUS.UNAUTHORIZED);
    }

    const createdResource = await ResourceService.createResource(
      resource,
      userId,
      parentResourceId
    );

    response.send({
      message: "Successfully created resource",
      data: createdResource.createdResource,
    });
  } catch (error) {
    next(error);
  }
};

const deleteResource: RequestHandler = async (request, response, next) => {
  try {
    const resourceId = request.params.resourceId as string | undefined;
    if (!resourceId) {
      throw new AppError(
        "resourceId not provided in the request parameters",
        STATUS.BAD_REQUEST
      );
    }

    const userId = request.userData?.id;
    if (!userId) {
      throw new AppError(
        "User not authorized to perform this action",
        STATUS.UNAUTHORIZED
      );
    }

    await ResourceService.deleteResourceWithCleanup(userId, resourceId);

    response.send({
      message: "Successfuly deleted resource",
    });
  } catch (error) {
    next(error);
  }
};

const moveResourcesBodySchema = z.object({
  // Accepts one or multiple ids (array format)
  resourcesId: z.string().or(z.array(z.string())),
  // If empty then move to root
  destinationId: z.string().optional(),
});
const moveResources: RequestHandler = async (request, response, next) => {
  try {
    const { resourcesId, destinationId } = validateSchema(
      moveResourcesBodySchema,
      request.body
    );

    const userId = request.userData?.id;
    if (!userId) {
      throw new AppError(
        "User is not authorized to perform this action",
        STATUS.UNAUTHORIZED
      );
    }

    await ResourceService.moveResources(
      // resourcesId must be parsed into an array even if the API user does not pass it as one
      !Array.isArray(resourcesId) ? [resourcesId] : resourcesId,
      destinationId || null,
      userId
    );

    response.send({
      message: "Successfuly moved resources",
    });
  } catch (error) {
    next(error);
  }
};

const updateResourceBodySchema = z.object({
  resourceType: z.nativeEnum(ResourceType),
  fileType: z.nativeEnum(FileType).optional(),
  name: z.string(),
});
// Updates resource content (File | Folder), not the resource table itself
export const updateResourceContent: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    const resourceId = request.params.resourceId as string | undefined;
    if (!resourceId) {
      throw new AppError(
        "Missing resourceId request parameter",
        STATUS.BAD_REQUEST
      );
    }
    const resource = validateSchema(updateResourceBodySchema, request.body);

    await ResourceService.updateResourceContent(resourceId, resource);

    response.send({
      message: "Successfuly updated resource content",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllResources,
  createResource,
  deleteResource,
  moveResources,
  updateResourceContent,
};
