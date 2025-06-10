import { Router } from "express";
import { ResourceController } from "../controllers";
import authorize from "../middlewares/authorize";

const resourceRouter = Router();

/**
 * Insert your routes here
 * @example exampleRouter.get("/", getExample)
 */
resourceRouter.use(authorize);

resourceRouter.delete("/:resourceId", ResourceController.deleteResource);
resourceRouter.put(
  "/content/:resourceId",
  ResourceController.updateResourceContent
);

resourceRouter.get("/", ResourceController.getAllResources);
resourceRouter.post("/", ResourceController.createResource);

resourceRouter.put("/move", ResourceController.moveResources);

export default resourceRouter;
