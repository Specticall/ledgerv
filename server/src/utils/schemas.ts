import { FileType, ResourceType } from "@prisma/client";
import { z } from "zod";

export const folderSchema = z.object({
  resourceType: z.literal(ResourceType.folder),
  name: z.string(),
});

export const fileSchema = z.object({
  resourceType: z.literal(ResourceType.file),
  fileType: z.nativeEnum(FileType),
  name: z.string(),
  fileKey: z.string(),
  fileSizeMB: z.number(),
});

export const resourceSchema = z.discriminatedUnion("resourceType", [
  folderSchema,
  fileSchema,
]);
