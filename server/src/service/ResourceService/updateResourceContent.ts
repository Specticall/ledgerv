import { FileType, ResourceType } from "@prisma/client";
import { ResourceRepository } from "../../repository";
import { AppError } from "../../utils/http/AppError";
import { STATUS } from "../../utils/http/statusCodes";

const updateResourceContent = async (
  resourceId: string,
  data: {
    resourceType: ResourceType;
    name?: string;
    fileType?: FileType;
  }
) => {
  // Check if resource exists
  const resource = await ResourceRepository.getResourceById(resourceId);
  if (!resource) {
    throw new AppError("Resource does not exists", STATUS.NOT_FOUND);
  }

  if (data.resourceType === "file") {
    if (resource.type !== "file") {
      throw new AppError(
        "Provided resource id and data does not match, required: 'file'",
        STATUS.BAD_REQUEST
      );
    }

    return await ResourceRepository.updateResourceById(resourceId, {
      File: {
        name: data.name,
        type: data.fileType,
      },
    });
  }

  if (data.resourceType === "folder") {
    if (resource.type !== "folder") {
      throw new AppError(
        "Provided resource id and data does not match, required: 'folder'",
        STATUS.BAD_REQUEST
      );
    }
    return await ResourceRepository.updateResourceById(resourceId, {
      Folder: {
        name: data.name,
      },
    });
  }
};

export default updateResourceContent;
