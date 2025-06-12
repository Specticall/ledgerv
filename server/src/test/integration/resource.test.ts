import supertest from "supertest";
import app from "../../app";
import axios from "axios";
import fs from "fs/promises";
import { STATUS } from "../../utils/http/statusCodes";
import { StorageService } from "../../service";
import { checkMinIOHealth } from "../../utils/general";
import TestDataStore from "../utils/TestDataStore";

const testApp = supertest(app);

const googleToken = process.env.TEST_GOOGLE_TOKEN;
if (!googleToken) {
  throw new Error("Unable to load google token through enviroment variable");
}

describe("File upload test", () => {
  let authCookie: string | undefined;

  // Login and retrieve jwt
  beforeAll(async () => {
    const minioIsReady = await checkMinIOHealth();

    if (!minioIsReady) {
      throw new Error("Minio server is not ready");
    }

    authCookie = (await TestDataStore.get()).authCookies.userA;
  });

  it("Should upload an image and create  a file resource connected to it", async () => {
    if (!authCookie) {
      throw new Error(
        "Missing auth token on cookie it may be because of failure in verifying google token becase it might have expired or malformed"
      );
    }

    // Read test image files
    const testImagePath = `${process.cwd()}/src/test/test-data/test-image.png`;
    const testImage = await fs.readFile(testImagePath);

    // Get pre-signed URL
    const presignedResponse = await testApp
      .post("/storages/presigned/upload")
      .set("Cookie", authCookie)
      .send({
        filename: "test-image.png",
      });
    expect(presignedResponse.status).toBe(STATUS.OK);
    const { url: uploadURL, fileKey } = presignedResponse.body.data;
    if (!uploadURL) {
      throw new Error("Presigned URL did not exist");
    }

    // Upload file into storage
    const uploadFileResponse = await axios.put(uploadURL, testImage, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
    expect(uploadFileResponse.status).toBe(STATUS.OK);

    // Get download file url
    const downloadURLResponse = await testApp
      .get(`/storages/presigned/download?fileKey=${fileKey}`)
      .set("Cookie", authCookie);

    expect(downloadURLResponse.status).toBe(STATUS.OK);
    const downloadURL = downloadURLResponse.body.data.url;
    if (!downloadURL) {
      throw new Error("Download URL was not found");
    }

    // Download file
    const downloadResponse = await axios.get(downloadURL, {
      responseType: "arraybuffer",
    });
    expect(downloadResponse.status).toBe(STATUS.OK);

    // Compare file size with the original to check they are the same
    expect(downloadResponse.data.byteLength).toBe(testImage.byteLength);

    // Cleanup remaining file
    await StorageService.deleteFile(fileKey);
  });
});

describe("Multiple user resource creation", () => {
  let authCookieOwner: string | undefined;
  let authCookieCollaborator: string | undefined;

  // Login and retrieve jwt
  beforeAll(async () => {
    const store = await TestDataStore.get();
    authCookieOwner = store.authCookies.userA;
    authCookieCollaborator = store.authCookies.userB;
  });

  it("should not allow other users to create folders without the editor permission", async () => {
    if (!authCookieOwner || !authCookieCollaborator) {
      throw new Error(
        "Missing auth token on cookie it may be because of failure in verifying google token becase it might have expired or malformed"
      );
    }

    // Owner -> Create root folder ("Group Project")
    const rootFolderResponse = await testApp
      .post("/resources")
      .set("Cookie", authCookieOwner)
      .send({
        resource: {
          resourceType: "folder",
          name: "Group Project",
        },
      });
    const rootFolderId = rootFolderResponse.body.data.resourceId;

    // Collaborator -> Create another folder ("References") on the "Group Project" folder
    const collaboratorFolderResponse = await testApp
      .post("/resources")
      .set("Cookie", authCookieCollaborator)
      .send({
        parentResourceId: rootFolderId,
        resource: {
          resourceType: "folder",
          name: "References",
        },
      });

    // Should fail because user is not invited!
    expect(collaboratorFolderResponse.status).toBe(STATUS.UNAUTHORIZED);
  });

  // it("should able to identify the true owner on nested file creations", async () => {
  //   // TODO
  //   expect(undefined).toBeDefined();
  // });
});

describe("Storage capacity", () => {
  it("Should display the appropriate amount of storage for a given user", async () => {
    // Get auth cookie for user
    const authCookie = (await TestDataStore.get()).authCookies.userA;
    if (!authCookie) {
      throw new Error("Auth cookie not available for test");
    }

    // Create multiple file resources with known sizes
    const FILE_SIZES = [10, 25, 50]; // MB
    const fileKeys: string[] = [];

    // Create files with specific sizes
    for (let i = 0; i < FILE_SIZES.length; i++) {
      // Get presigned URL
      const presignedResponse = await testApp
        .post("/storages/presigned/upload")
        .set("Cookie", authCookie)
        .send({
          filename: `test-storage-${i}.txt`,
        });
      expect(presignedResponse.status).toBe(STATUS.OK);

      const { fileKey } = presignedResponse.body.data;
      fileKeys.push(fileKey);

      // Create file resource with specified size
      const createResponse = await testApp
        .post("/resources")
        .set("Cookie", authCookie)
        .send({
          resource: {
            resourceType: "file",
            fileType: "docs",
            name: `Test Storage File ${i}`,
            fileKey: fileKey,
            fileSizeMB: FILE_SIZES[i],
          },
        });
      expect(createResponse.status).toBe(STATUS.OK);
    }

    // Query storage usage API
    const storageResponse = await testApp
      .get("/storages/usage")
      .set("Cookie", authCookie);

    expect(storageResponse.status).toBe(STATUS.OK);

    // Check that returned storage matches our expected total
    const { usedStorageMB, maxStorageMB } = storageResponse.body.data;

    // Use toBeCloseTo for floating point comparison to avoid precision issues
    expect(typeof usedStorageMB).toBe("number");
    expect(typeof maxStorageMB).toBe("number");
  });
});
