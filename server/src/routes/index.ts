import storageRouter from "./storageRouter";
import resourceRouter from "./resourceRouter";
import authRouter from "./authRouter";
import { Router } from "express";

const router = Router();

// API Welcome Message
router.get("/", (_, response) => {
  response.send({
    message: "My-API-Name v0.0.1",
  });
});

/**
 * Insert your router here
 * @example router.use("/example", exampleRouter)
 */

router.use("/auth", authRouter);
router.use("/resources", resourceRouter);
router.use("/storages", storageRouter);

export default router;