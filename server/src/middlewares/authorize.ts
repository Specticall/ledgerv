import { RequestHandler } from "express";
import { JWTManager } from "../utils/JWTManager";
import { AppError } from "../utils/http/AppError";
import { STATUS } from "../utils/http/statusCodes";

const authorize: RequestHandler = async (request, _, next) => {
  try {
    const token = request.cookies.token;
    if (!token) {
      throw new AppError("Request token not found", STATUS.UNAUTHORIZED);
    }

    const payload = JWTManager.verify(token);
    request.userData = payload;

    next();
  } catch (err) {
    next(err);
  }
};

export default authorize;
