import { z } from "zod";
import { ResourceRepository, UserRepository } from "../../repository";
import { resourceSchema } from "../../utils/schemas";
import { AppError } from "../../utils/http/AppError";
import { STATUS } from "../../utils/http/statusCodes";
import { Permission, Resource } from "@prisma/client";
import UserResourceRepository from "../../repository/UserResourceRepository";

const createResource = async (
  resource: z.infer<typeof resourceSchema>,
  userCreatorId: number,
  parentId?: string | null
) => {
  // Validate user
  const user = await UserRepository.getUserById(userCreatorId);
  if (!user) {
    throw new AppError(
      `User with the id ${userCreatorId} does not exist`,
      STATUS.BAD_REQUEST
    );
  }

  // Create file / folder based on `resourceType`
  let createdResource: Resource | undefined;
  if (resource.resourceType !== "file" && resource.resourceType !== "folder") {
    throw new AppError(
      "Invalid resource type, `resourceType` must be 'file' or 'folder'",
      STATUS.BAD_REQUEST
    );
  }

  // Get "true owner"'s id from parent resouce, (the person that gets billed for storage).
  let trueOwnerId = user.userId;
  if (parentId) {
    // Each parent resource WILL ALWAYS contain the true owner id, this is because only true owners are allowed to create root resources.
    // If the resource is located at the root (no parentResourceId provided) then the creator is the true owner.
    const parentResouce = await ResourceRepository.getResourceById(parentId);
    if (!parentResouce) {
      throw new AppError(
        "Invalid parent resource id: unable to find the corresponding resource",
        STATUS.NOT_FOUND
      );
    }
    trueOwnerId = parentResouce.trueOwnerId;

    // Check if the user has the appropriate permission to this action
    const userResource =
      await UserResourceRepository.getUserResourceByUserAndResourceId(
        user.userId,
        parentId
      );
    const hasWritePermission =
      userResource &&
      (userResource.permission === Permission.owner ||
        userResource.permission === Permission.editor);

    if (!hasWritePermission) {
      throw new AppError(
        "Not authorized: You need editor or owner permission to create resources in this",
        STATUS.UNAUTHORIZED
      );
    }
  }

  // Create file
  if (resource.resourceType === "file") {
    if (!resource.fileKey) {
      throw new AppError(
        "Failed to create resource: resource type is 'file' but no 'url' is provided",
        STATUS.BAD_REQUEST
      );
    }

    if (!resource.fileType) {
      throw new AppError(
        "Failed to create resource: resource type is 'file' but no 'fileType' is provided",
        STATUS.BAD_REQUEST
      );
    }
    createdResource = await ResourceRepository.createFile(
      resource,
      trueOwnerId,
      parentId
    );
  }

  // Create folder
  if (resource.resourceType === "folder") {
    createdResource = await ResourceRepository.createFolder(
      resource,
      trueOwnerId,
      parentId
    );
  }

  if (!createdResource) {
    throw new AppError(
      "Resource was not defined after its supposed creation",
      STATUS.INTERNAL_SERVER_ERROR
    );
  }

  // Create UserResource table which holds data of the user who owns the resource
  const userResource = await UserResourceRepository.createOwnerUserResource(
    userCreatorId,
    createdResource.resourceId,
    // User who created the files are automatically classified as "owners"
    "owner"
  );

  return {
    userResource,
    createdResource,
  };
};

export default createResource;
