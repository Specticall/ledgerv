import { Folder, Resource, File } from "@prisma/client";
import { ResourceRepository } from "../../repository";

const getResourceById = async (resourceId: string) => {
  const resource = await ResourceRepository.getResourceWithDetailsById(
    resourceId
  );
  if (!resource) return undefined;

  if (resource.type === "file" && resource.File) {
    return resource as Resource & { type: "file"; File: File };
  }

  if (resource.type === "folder" && resource.Folder) {
    return resource as Resource & { type: "folder"; Folder: Folder };
  }
};

export default getResourceById;
