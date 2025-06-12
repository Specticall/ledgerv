import axios from "axios";
import { UserRepository } from "../repository";
import AuthService from "./AuthService";

jest.mock("axios");
const mockAxios = axios as jest.Mocked<typeof axios>;

it("should create a user when a google token is given for the first time", async () => {
  // Simulate calls to the google API, when `axios.get` gets called for the first time, we will gurantee it's promise resolve value to the following. Removing the need to call the actual google API
  const mockGoogleAPIResponse = {
    sub: "12345",
    name: "Test User",
    given_name: "Test",
    picture: "https://example.com/photo.jpg",
    email: "test@example.com",
    email_verified: true,
  };
  mockAxios.get.mockResolvedValueOnce({
    data: mockGoogleAPIResponse,
  });

  const result = await AuthService.loginWithGoogle("fake-token");

  // Ensures a new user is created for the first login
  const newUser = await UserRepository.getUserByEmail(
    mockGoogleAPIResponse.email
  );

  expect(result).toBeDefined();
  expect(newUser).toBeDefined();
  expect(newUser?.email).toBe(mockGoogleAPIResponse.email);
});
