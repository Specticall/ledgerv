import { ResourceRepository } from "../../repository";
import UserResourceRepository from "../../repository/UserResourceRepository";
import { AppError } from "../../utils/http/AppError";
import { STATUS } from "../../utils/http/statusCodes";

/**
 * Moves one or more resources to the given destination folder resource
 */
const moveResources = async (
  resourceIdList: string[],
  destinationId: string | null,
  userId: number
) => {
  // Validate ownership - make sure the requester owns / have access to the resource
  const user =
    await UserResourceRepository.getManyUserResourceByUserAndResourceId(
      userId,
      resourceIdList
    );
  if (user.some((user) => user.permission === "viewer")) {
    throw new AppError(
      "This user is not authorized to peform this action",
      STATUS.UNAUTHORIZED
    );
  }

  // Validate destination
  if (destinationId) {
    const destination = await ResourceRepository.getResourceById(destinationId);
    if (!destination) {
      throw new AppError(
        "Destination resource does not exist",
        STATUS.BAD_REQUEST
      );
    }
    if (destination.type !== "folder") {
      throw new AppError(
        "Destination resource must be a folder",
        STATUS.BAD_REQUEST
      );
    }
  }
  // Move resources
  return await ResourceRepository.updateManyResourceByIds(resourceIdList, {
    parentResourceId: destinationId,
  });
};

export default moveResources;
