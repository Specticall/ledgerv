import { RequestHandler } from "express";
import { StorageService } from "../service";
import { z } from "zod";
import { validateSchema } from "../utils/validateSchema";
import { AppError } from "../utils/http/AppError";
import { STATUS } from "../utils/http/statusCodes";

const presignedURLBodySchema = z.object({
  filename: z.string(),
});
const getPresignedUploadURL: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    const { filename } = validateSchema(presignedURLBodySchema, request.body);

    const userId = request.userData?.id;
    if (!userId) {
      throw new AppError("User not authorized", STATUS.UNAUTHORIZED);
    }

    const { url, fileKey } = await StorageService.getPresignedUploadURL(
      filename,
      userId
    );

    response.send({
      message: "Successfully retrieved URL",
      data: {
        url,
        fileKey,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getPresignedDownloadURL: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    const fileKey = request.query.fileKey as string | undefined;
    if (!fileKey) {
      throw new AppError(
        "fileKey not found in the request parameter",
        STATUS.BAD_REQUEST
      );
    }

    const url = await StorageService.getPresignedDownloadURL(fileKey);

    response.send({
      message: "Successfully retrieved URL",
      data: {
        url,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStorageUsed: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    const userId = request.userData?.id;
    if (!userId) {
      throw new AppError(
        "User not authorized to perform this action",
        STATUS.UNAUTHORIZED
      );
    }

    const storageUsed = await StorageService.getStorageUsed(userId);

    response.send({
      message: "Successfuly retrieved storage usage data",
      data: storageUsed,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getPresignedUploadURL,
  getPresignedDownloadURL,
  getStorageUsed,
};
