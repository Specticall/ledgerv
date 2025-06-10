import { User } from "@prisma/client";
import { prisma } from "../config/config";
import ResourceService from "./ResourceService";
import { ResourceRepository } from "../repository";

let testUser: User;
let testCollaborator: User;

// Register a user to use as owner
beforeAll(async () => {
  testUser = await prisma.user.create({
    data: {
      email: "resourceservice@gmail.com",
      name: "resourceservice",
      profilePictureUrl: "http://url",
    },
  });
  testCollaborator = await prisma.user.create({
    data: {
      email: "resourceservicecollab@gmail.com",
      name: "resourceservicecollab",
      profilePictureUrl: "http://url",
    },
  });
});

describe("Folder creation", () => {
  it("should create a folder at the root", async () => {
    const folder = {
      name: "Home",
      resourceType: "folder",
    } as const;

    const { createdResource: resource } = await ResourceService.createResource(
      folder,
      testUser.userId
    );

    expect(resource).toBeDefined();
    expect(resource.parentResourceId).toBe(null);
    expect(resource.trueOwnerId).toBe(testUser.userId);
  });

  it("should create folder under a specified parent folder id", async () => {
    const parentFolder = {
      name: "Home",
      resourceType: "folder",
    } as const;
    const { createdResource: parent } = await ResourceService.createResource(
      parentFolder,
      testUser.userId
    );

    const childFolder = {
      name: "Documents",
      resourceType: "folder",
    } as const;

    const { createdResource: child } = await ResourceService.createResource(
      childFolder,
      testUser.userId,
      parent.resourceId
    );

    expect(child).toBeDefined();
    expect(child.parentResourceId).toBe(parent.resourceId);
  });
});

describe("File creation", () => {
  it("Should create a file at root", async () => {
    const file = {
      name: "some random files",
      resourceType: "file",
      fileType: "other",
      fileKey: "myfilekey.png",
      fileSizeMB: 100,
    } as const;

    const { createdResource: resource } = await ResourceService.createResource(
      file,
      testUser.userId
    );

    expect(resource).toBeDefined();
    expect(resource.type).toBe("file");
    expect(resource.parentResourceId).toBe(null);
  });

  it("Should create a file with a folder as its parent", async () => {
    const parentFolderData = {
      name: "Home",
      resourceType: "folder",
    } as const;
    const { createdResource: parent } = await ResourceService.createResource(
      parentFolderData,
      testUser.userId
    );

    const fileData = {
      name: "some random files",
      resourceType: "file",
      fileType: "other",
      fileKey: "myfilekey.png",
      fileSizeMB: 100,
    } as const;
    const { createdResource: file } = await ResourceService.createResource(
      fileData,
      testUser.userId,
      parent.resourceId
    );

    expect(file).toBeDefined();
    expect(file.type).toBe("file");
    expect(file.parentResourceId).toBe(parent.resourceId);
  });
});

describe("Resource retrieval", () => {
  const files = [
    {
      name: "file a",
      resourceType: "file",
      fileType: "other",
      fileKey: "myfilekey.png",
      fileSizeMB: 100,
    },
    {
      name: "file b",
      resourceType: "file",
      fileType: "other",
      fileKey: "myfilekey.png",
      fileSizeMB: 100,
    },
  ] as const;

  const folders = [
    {
      name: "Projects",
      resourceType: "folder",
    },
    {
      name: "Movies",
      resourceType: "folder",
    },
  ] as const;

  it("should return all user's resources that exists at root", async () => {
    // Create files
    await Promise.all(
      files.map((file) => ResourceService.createResource(file, testUser.userId))
    );

    // Create folders
    await Promise.all(
      folders.map((folder) =>
        ResourceService.createResource(folder, testUser.userId)
      )
    );

    const resources = await ResourceService.getAllUserResources(
      testUser.userId
    );

    // Check if all folders exist in the resources
    folders.forEach((folder) => {
      const foundFolder = resources.folders.some(
        (r) => r.Resource.Folder?.name === folder.name
      );
      expect(foundFolder).toBe(true);
    });

    // Check if all files exist in the resources
    files.forEach((file) => {
      const foundFile = resources.files.some(
        (r) => r.Resource.File?.name === file.name
      );
      expect(foundFile).toBe(true);
    });
  });

  it("should return all user resources under a folder id", async () => {
    const parentFolder = {
      name: "My Documents",
      resourceType: "folder",
    } as const;
    const { createdResource: parent } = await ResourceService.createResource(
      parentFolder,
      testUser.userId
    );

    // Create files
    await Promise.all(
      files.map((file) =>
        ResourceService.createResource(file, testUser.userId, parent.resourceId)
      )
    );

    // Create folders
    await Promise.all(
      folders.map((folder) =>
        ResourceService.createResource(
          folder,
          testUser.userId,
          parent.resourceId
        )
      )
    );

    const resources = await ResourceService.getAllUserResources(
      testUser.userId,
      parent.resourceId
    );

    // Check if all folders exist in the resources
    folders.forEach((folder) => {
      const foundFolder = resources.folders.some(
        (r) =>
          r.Resource.Folder?.name === folder.name &&
          r.Resource.parentResourceId === parent.resourceId
      );
      expect(foundFolder).toBe(true);
    });

    // Check if all files exist in the resources
    files.forEach((file) => {
      const foundFile = resources.files.some(
        (r) =>
          r.Resource.File?.name === file.name &&
          r.Resource.parentResourceId === parent.resourceId
      );
      expect(foundFile).toBe(true);
    });
  });
});

describe("Resource deletion", () => {
  it("Should delete an existing resource", async () => {
    const file = {
      name: "deleted later",
      resourceType: "file",
      fileType: "other",
      fileKey: "myfilekey.png",
      fileSizeMB: 100,
    } as const;

    const { createdResource: resource } = await ResourceService.createResource(
      file,
      testUser.userId
    );
    expect(resource).toBeDefined();

    // Delete the resource
    await ResourceService.deleteResourceWithCleanup(
      testUser.userId,
      resource.resourceId
    );

    const deletedResource = await ResourceRepository.getResourceById(
      resource.resourceId
    );
    expect(deletedResource).toBeFalsy();
  });
});

describe("Resource modification", () => {
  it("Should move singular resource", async () => {
    // Create folder
    const { createdResource: folder } = await ResourceService.createResource(
      {
        name: "My Home",
        resourceType: "folder",
      },
      testUser.userId
    );

    // Create file at root
    const { createdResource: file } = await ResourceService.createResource(
      {
        name: "somerandomfiles",
        resourceType: "file",
        fileKey: "myfile",
        fileType: "other",
        fileSizeMB: 100,
      },
      testUser.userId
    );

    // Move file from root into folder
    await ResourceService.moveResources(
      [file.resourceId],
      folder.resourceId,
      testUser.userId
    );

    const movedResource = await ResourceService.getResourceById(
      file.resourceId
    );

    // Check if the moved resource parent is the folder
    expect(movedResource?.parentResourceId).toBe(folder.resourceId);
  });
});
