import { ResourceRepository } from "../../repository";
import UserResourceRepository from "../../repository/UserResourceRepository";
import { AppError } from "../../utils/http/AppError";
import { STATUS } from "../../utils/http/statusCodes";
import StorageService from "../StorageService";
import getResourceById from "./getResourceById";

/**
 * TODO: Implement background job task (with something like bullmq) to perform file cleanup on failure.
 */
const deleteResourceWithCleanup = async (
  userId: number,
  resourceId: string
) => {
  // Validate resource existence
  const resourceToBeDeleted = await getResourceById(resourceId);
  if (!resourceToBeDeleted) {
    throw new AppError("Resource not found", STATUS.NOT_FOUND);
  }

  // Check if the user owns this resource
  const userOwnsResource =
    await UserResourceRepository.getUserResourceByUserAndResourceId(
      userId,
      resourceId
    );

  if (!userOwnsResource) {
    throw new AppError(
      "This resource is not owned by this user",
      STATUS.UNAUTHORIZED
    );
  }

  if (userOwnsResource.permission !== "owner") {
    throw new AppError(
      "This user is not authorized to perform this action",
      STATUS.UNAUTHORIZED
    );
  }

  // Delete resource
  await ResourceRepository.deleteResourceById(resourceId);

  // For file type resources, cleanup remaining files in the object storage
  if (resourceToBeDeleted.type === "file") {
    await StorageService.deleteFile(resourceToBeDeleted.File.fileKey);
  }
};

export default deleteResourceWithCleanup;
