import { User } from "@prisma/client";
import UserRepository from "./UserRepository";
import ResourceRepository from "./ResourceRepository";
import { ResourceService } from "../service";

let testUser: User;
beforeAll(async () => {
  testUser = await UserRepository.createUser({
    email: "resourcerepo@gmail.com",
    name: "resourcerepotest",
    profilePictureUrl: "url",
  });
});

describe("Storage Repository", () => {
  // Cleanup
  it.only("Should query the users used storage size", async () => {
    // Create multiple files (4 * 1000 MB)
    const FILE_COUNT = 4;
    const FILE_SIZE = 1000;
    await Promise.all(
      new Array(FILE_COUNT).fill("x").map(() => {
        return ResourceService.createResource(
          {
            resourceType: "file",
            fileType: "docs",
            fileKey: "myfile",
            fileSizeMB: FILE_SIZE,
            name: "test file",
          },
          testUser.userId
        );
      })
    );

    const result = await ResourceRepository.getStorageUsedByUserId(
      testUser.userId
    );

    expect(typeof result).toBe("number");
    expect(result).toBe(FILE_COUNT * FILE_SIZE);
  });
});
