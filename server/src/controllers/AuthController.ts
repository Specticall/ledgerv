import { RequestHandler } from "express";
import { z } from "zod";
import { validateSchema } from "../utils/validateSchema";
import { AuthService } from "../service";
import { SEVEN_DAYS } from "../config/config";

const loginWithGoogleSchema = z.object({
  googleToken: z.string(),
});

const loginWithGoogle: RequestHandler = async (request, response, next) => {
  try {
    const { googleToken } = validateSchema(loginWithGoogleSchema, request.body);
    const token = await AuthService.loginWithGoogle(googleToken);

    // Inject jwt token into cookie
    response.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: SEVEN_DAYS,
    });

    response.send({
      message: "Successfuly logged in user",
    });
  } catch (error) {
    next(error);
  }
};

export default { loginWithGoogle };
