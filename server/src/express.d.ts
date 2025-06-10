import { JWTPayload } from "./utils/JWTManager";

declare global {
  namespace Express {
    interface Request {
      userData?: JWTPayload;
      // Add any other custom properties you need
    }
  }
}
