import TestDataStore from "./utils/TestDataStore";
import { UserRepository } from "../repository";
import { JWTManager } from "../utils/JWTManager";

/**
 * This setup will mock an account creation, creates a JWT token then stores it in a store that can be accessed globally via the `TestDataStore` Class
 */
export default async () => {
  const googleToken = process.env.TEST_GOOGLE_TOKEN;
  if (!googleToken) {
    throw new Error("Unable to load google token through enviroment variable");
  }

  // Mock login and user creation, created multiple user for permission testing
  const userA = await UserRepository.createUser({
    email: "testinguser@gmail.com",
    name: "testuser",
    profilePictureUrl: "url",
  });
  const userB = await UserRepository.createUser({
    email: "testinguser2@gmail.com",
    name: "testuser",
    profilePictureUrl: "url",
  });

  const tokenA = JWTManager.createToken({
    email: userA.email,
    id: userA.userId,
    username: userA.name,
  });
  const tokenB = JWTManager.createToken({
    email: userB.email,
    id: userB.userId,
    username: userB.name,
  });

  // Save the test data json to be used across test suites
  await TestDataStore.set({
    authCookies: {
      userA: `token=${tokenA}`,
      userB: `token=${tokenB}`,
    },
  });
};
