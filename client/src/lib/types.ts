import type { ResourceSummary } from "@/hooks/queries/useResourcesQuery";

export type APISuccessResponse<T> = {
  message: string;
  data: T;
};

export type ResourceId = string;
export type UserId = string;

export type ResourceTypes = "folder" | "file";
export type FileTypes = "audio" | "docs" | "pdf" | "other";
export type Folder = ResourceSummary["folders"][number];
export type File = ResourceSummary["files"][number];
export type Resource = Folder | File;
