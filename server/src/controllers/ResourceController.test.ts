import supertest from "supertest";
import { STATUS } from "../utils/http/statusCodes";
import { checkMinIOHealth } from "../utils/general";
import app from "../app";
import { FileType, Folder, ResourceType } from "@prisma/client";
import TestDataStore from "../test/utils/TestDataStore";

const testApp = supertest(app);

const googleToken = process.env.TEST_GOOGLE_TOKEN;
if (!googleToken) {
  throw new Error("Unable to load Google token through environment variable");
}

describe("Resource API Tests", () => {
  let authCookie: string;
  let rootFolderId: string;
  let subFolderId: string;
  let fileId: string;

  // Login and set up test data
  beforeAll(async () => {
    // Ensure MinIO is ready
    const minioIsReady = await checkMinIOHealth();
    if (!minioIsReady) {
      throw new Error("MinIO server is not ready");
    }

    const data = await TestDataStore.get();
    authCookie = data.authCookies.userA;
    expect(authCookie).toBeDefined();

    // Create root test folder
    const rootFolderResponse = await testApp
      .post("/resources")
      .set("Cookie", authCookie)
      .send({
        resource: {
          name: "Test Root Folder",
          resourceType: "folder",
        },
      });

    expect(rootFolderResponse.status).toBe(STATUS.OK);
    rootFolderId = rootFolderResponse.body.data.resourceId;

    // create root test file
    await testApp
      .post("/resources")
      .set("Cookie", authCookie)
      .send({
        resource: {
          name: "Test Root File",
          resourceType: "file",
          fileType: "document",
          fileKey: "myfilekey",
          fileSizeMB: 100,
        },
      });

    // Create subfolder
    const subFolderResponse = await testApp
      .post("/resources")
      .set("Cookie", authCookie)
      .send({
        resource: {
          name: "Test Subfolder",
          resourceType: "folder",
        },
        parentResourceId: rootFolderId,
      });

    expect(subFolderResponse.status).toBe(STATUS.OK);
    subFolderId = subFolderResponse.body.data.resourceId;

    // Create test file using presigned URL
    const presignedResponse = await testApp
      .post("/storages/presigned/upload")
      .set("Cookie", authCookie)
      .send({
        filename: "test-file.txt",
      });

    const { fileKey } = presignedResponse.body.data;

    // Create file resource
    const fileResponse = await testApp
      .post("/resources")
      .set("Cookie", authCookie)
      .send({
        resource: {
          name: "Test File",
          resourceType: "file",
          fileType: "docs",
          fileKey: fileKey,
          fileSizeMB: 100,
        },
        parentResourceId: rootFolderId,
      });

    expect(fileResponse.status).toBe(STATUS.OK);
    fileId = fileResponse.body.data.resourceId;
  });

  describe("GET /resources", () => {
    it("should retrieve all resources at root level", async () => {
      const response = await testApp
        .get("/resources")
        .set("Cookie", authCookie);

      expect(response.status).toBe(STATUS.OK);
      expect(response.body.data).toHaveProperty("folders");
      expect(response.body.data).toHaveProperty("files");
    });

    it("should retrieve resources in a specific folder", async () => {
      const response = await testApp
        .get(`/resources?parentResourceId=${rootFolderId}`)
        .set("Cookie", authCookie);

      expect(response.status).toBe(STATUS.OK);
      expect(response.body.data.folders.length).toBeGreaterThanOrEqual(1);
      expect(response.body.data.files.length).toBeGreaterThanOrEqual(1);

      // Verify subfolder exists in response
      const foundSubfolder = response.body.data.folders.some(
        (folder: any) => folder.resourceId === subFolderId
      );
      expect(foundSubfolder).toBe(true);

      // Verify file exists in response
      const foundFile = response.body.data.files.some(
        (file: any) => file.resourceId === fileId
      );
      expect(foundFile).toBe(true);
    });

    it("should fail if user is not authenticated", async () => {
      const response = await testApp.get("/resources");
      expect(response.status).toBe(STATUS.UNAUTHORIZED);
    });
  });

  describe("POST /resources", () => {
    it("should create a new folder", async () => {
      const response = await testApp
        .post("/resources")
        .set("Cookie", authCookie)
        .send({
          resource: {
            name: "New Test Folder",
            resourceType: "folder",
          },
        });

      expect(response.status).toBe(STATUS.OK);
      expect(response.body.data).toHaveProperty("resourceId");
      expect(response.body.data.type).toBe("folder");
    });

    it("should create a nested folder", async () => {
      const response = await testApp
        .post("/resources")
        .set("Cookie", authCookie)
        .send({
          resource: {
            name: "Nested Folder",
            resourceType: "folder",
          },
          parentResourceId: rootFolderId,
        });

      expect(response.status).toBe(STATUS.OK);
      expect(response.body.data).toHaveProperty("resourceId");
      expect(response.body.data.parentResourceId).toBe(rootFolderId);
    });

    it("should fail with invalid resource type", async () => {
      const response = await testApp
        .post("/resources")
        .set("Cookie", authCookie)
        .send({
          resource: {
            name: "Invalid Resource",
            resourceType: "invalid-type",
          },
        });

      expect(response.status).toBe(STATUS.BAD_REQUEST);
    });

    it("should fail if user is not authenticated", async () => {
      const response = await testApp.post("/resources").send({
        resource: {
          name: "Unauthenticated Folder",
          resourceType: "folder",
        },
      });

      expect(response.status).toBe(STATUS.UNAUTHORIZED);
    });
  });

  describe("DELETE /resources/:resourceId", () => {
    it("should delete a resource", async () => {
      // Create a resource to delete
      const createResponse = await testApp
        .post("/resources")
        .set("Cookie", authCookie)
        .send({
          resource: {
            name: "Resource to Delete",
            resourceType: "folder",
          },
        });

      const resourceId = createResponse.body.data.resourceId;

      // Delete the resource
      const deleteResponse = await testApp
        .delete(`/resources/${resourceId}`)
        .set("Cookie", authCookie);

      expect(deleteResponse.status).toBe(STATUS.OK);

      // Verify resource is deleted
      const checkResponse = await testApp
        .get("/resources")
        .set("Cookie", authCookie);

      const resourceExists = checkResponse.body.data.folders.some(
        (folder: Folder) => folder.resourceId === resourceId
      );
      expect(resourceExists).toBe(false);
    });

    it("should fail with non-existent resource ID", async () => {
      const response = await testApp
        .delete("/resources/non-existent-id")
        .set("Cookie", authCookie);

      expect(response.status).toBe(STATUS.NOT_FOUND);
    });

    it("should fail if user is not authenticated", async () => {
      const response = await testApp.delete(`/resources/${rootFolderId}`);

      expect(response.status).toBe(STATUS.UNAUTHORIZED);
    });
  });

  describe("PUT /resources/move", () => {
    it("should move a resource to another folder", async () => {
      // Create a resource to move
      const createResponse = await testApp
        .post("/resources")
        .set("Cookie", authCookie)
        .send({
          resource: {
            name: "Resource to Move",
            resourceType: "folder",
          },
        });

      const resourceToMoveId = createResponse.body.data.resourceId;

      // Move the resource
      const moveResponse = await testApp
        .put("/resources/move")
        .set("Cookie", authCookie)
        .send({
          resourcesId: resourceToMoveId,
          destinationId: subFolderId,
        });

      expect(moveResponse.status).toBe(STATUS.OK);

      // Verify resource was moved
      const checkResponse = await testApp
        .get(`/resources?parentResourceId=${subFolderId}`)
        .set("Cookie", authCookie);

      const resourceMoved = checkResponse.body.data.folders.some(
        (folder: Folder) => folder.resourceId === resourceToMoveId
      );
      expect(resourceMoved).toBe(true);
    });

    it("should move multiple resources at once", async () => {
      // Create resources to move
      const createRes1 = await testApp
        .post("/resources")
        .set("Cookie", authCookie)
        .send({
          resource: {
            name: "Multi-Move 1",
            resourceType: "folder",
          },
        });

      const createRes2 = await testApp
        .post("/resources")
        .set("Cookie", authCookie)
        .send({
          resource: {
            name: "Multi-Move 2",
            resourceType: "folder",
          },
        });

      const resId1 = createRes1.body.data.resourceId;
      const resId2 = createRes2.body.data.resourceId;

      // Move multiple resources
      const moveResponse = await testApp
        .put("/resources/move")
        .set("Cookie", authCookie)
        .send({
          resourcesId: [resId1, resId2],
          destinationId: subFolderId,
        });

      expect(moveResponse.status).toBe(STATUS.OK);
    });

    it("should move resource to root when destinationId is omitted", async () => {
      // Create a resource under subfolder
      const createResponse = await testApp
        .post("/resources")
        .set("Cookie", authCookie)
        .send({
          resource: {
            name: "Move to Root",
            resourceType: "folder",
          },
          parentResourceId: subFolderId,
        });

      const resourceId = createResponse.body.data.resourceId;

      // Move to root
      const moveResponse = await testApp
        .put("/resources/move")
        .set("Cookie", authCookie)
        .send({
          resourcesId: resourceId,
        });

      expect(moveResponse.status).toBe(STATUS.OK);

      // Verify resource is at root
      const checkResponse = await testApp
        .get("/resources")
        .set("Cookie", authCookie);

      const resourceAtRoot = checkResponse.body.data.folders.some(
        (folder: Folder & { parentResourceId: string }) =>
          folder.resourceId === resourceId && !folder.parentResourceId
      );
      expect(resourceAtRoot).toBe(true);
    });
  });

  describe("PUT /resources/content/:resourceId", () => {
    it("should successfully update a resource", async () => {
      const updateData = {
        resourceType: ResourceType.folder,
        name: "Updated Folder Name",
      };

      const response = await testApp
        .put(`/resources/content/${subFolderId}`) // Using correct route
        .set("Cookie", authCookie)
        .send(updateData);

      expect(response.status).toBe(STATUS.OK);
      expect(response.body.message).toBe(
        "Successfuly updated resource content"
      );
    });

    it("should fail update when wrong id type is passed in", async () => {
      const updateData = {
        resourceType: ResourceType.file,
        fileType: FileType.docs,
        name: "Updated File Name",
      };

      const response = await testApp
        // Supposed to pass FILE ID not folder
        .put(`/resources/content/${subFolderId}`)
        .set("Cookie", authCookie)
        .send(updateData);

      expect(response.status).toBe(STATUS.BAD_REQUEST);
    });

    it("should update a file resource with file type", async () => {
      const updateData = {
        resourceType: ResourceType.file,
        fileType: FileType.docs,
        name: "Updated File Name",
      };

      const response = await testApp
        .put(`/resources/content/${fileId}`)
        .set("Cookie", authCookie)
        .send(updateData);

      expect(response.status).toBe(STATUS.OK);
    });

    it("should fail with invalid resource type", async () => {
      const invalidData = {
        resourceType: "invalid_type",
        name: "Invalid Type",
      };

      const response = await testApp
        .put(`/resources/content/${subFolderId}`)
        .set("Cookie", authCookie)
        .send(invalidData);

      expect(response.status).toBe(STATUS.BAD_REQUEST);
    });

    it("should fail with non-existent resource ID", async () => {
      const response = await testApp
        .put("/resources/content/non-existent-id")
        .set("Cookie", authCookie)
        .send({
          resourceType: ResourceType.folder,
          name: "Won't Update",
        });

      expect(response.status).not.toBe(STATUS.OK);
    });

    it("should fail if not authenticated", async () => {
      const response = await testApp
        .put(`/resources/content/${subFolderId}`)
        .send({
          resourceType: ResourceType.folder,
          name: "Updated Name",
        });

      expect(response.status).toBe(STATUS.UNAUTHORIZED);
    });
  });
});
