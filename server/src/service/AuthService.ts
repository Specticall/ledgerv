import axios from "axios";
import { z } from "zod";
import { validateSchema } from "../utils/validateSchema";
import { UserRepository } from "../repository";
import { JWTManager } from "../utils/JWTManager";
import { GOOGLE_AUTH_API_URL } from "../config/config";

const googleResponseSchema = z.object({
  sub: z.string(),
  name: z.string(),
  given_name: z.string(),
  picture: z.string(),
  email: z.string(),
  email_verified: z.boolean(),
});

export const loginWithGoogle = async (googleToken: string) => {
  // Validate token to google
  const rawGoogleData = await axios.get(
    `${GOOGLE_AUTH_API_URL}?access_token=${googleToken}`
  );
  const { email, name, picture } = validateSchema(
    googleResponseSchema,
    rawGoogleData.data
  );

  // User should get registered if it's their first login
  let existingUser = await UserRepository.getUserByEmail(email);
  if (!existingUser) {
    existingUser = await UserRepository.createUser({
      email,
      name,
      profilePictureUrl: picture,
    });
  }

  // Create a new jwt token for the user
  return JWTManager.createToken({
    email: existingUser.email,
    username: existingUser.name,
    id: existingUser.userId,
  });
};

export default { loginWithGoogle };
