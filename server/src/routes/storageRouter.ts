import { Router } from "express";
import { StorageController } from "../controllers";
import authorize from "../middlewares/authorize";

const storageRouter = Router();

/**
 * Insert your routes here
 * @example exampleRouter.get("/", getExample)
 */
storageRouter.use(authorize);

// GET /storages/presigned/download?fileKey={FILE_KEY}
storageRouter.get(
  "/presigned/download",
  StorageController.getPresignedDownloadURL
);

storageRouter.post(
  "/presigned/upload",
  StorageController.getPresignedUploadURL
);

storageRouter.get("/usage", StorageController.getStorageUsed);

export default storageRouter;
