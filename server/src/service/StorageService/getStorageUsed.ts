import { ResourceRepository, UserRepository } from "../../repository";
import { AppError } from "../../utils/http/AppError";
import { STATUS } from "../../utils/http/statusCodes";

const getStorageUsed = async (userId: number) => {
  const user = await UserRepository.getUserById(userId);
  if (!user) {
    throw new AppError("User does not exist", STATUS.NOT_FOUND);
  }

  const usedStorageMB = await ResourceRepository.getStorageUsedByUserId(userId);
  const maxStorageMB = user.maxStorageQuotaMB;
  const availableStorageMB = maxStorageMB - usedStorageMB;

  return {
    usedStorageMB,
    maxStorageMB,
    availableStorageMB,
  };
};

export default getStorageUsed;
