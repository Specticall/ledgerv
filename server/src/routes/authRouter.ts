import { Router } from "express";
import { AuthController } from "../controllers";

const authRouter = Router();

/**
 * Insert your routes here
 * @example exampleRouter.get("/", getExample)
 */
authRouter.post("/login/google", AuthController.loginWithGoogle);

export default authRouter;
