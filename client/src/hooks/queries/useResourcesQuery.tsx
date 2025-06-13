import { API } from "@/lib/API";
import QUERY_KEYS from "@/lib/queryKeys";
import type { APISuccessResponse, FileTypes } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export type ResourceSummary = {
  folders: {
    resourceId: string;
    parentResourceId: string;
    type: "folder";
    name: string;
    createdAt: Date;
  }[];
  files: {
    resourceId: string;
    parentResourceId: string;
    type: "file";
    name: string;
    fileKey: string;
    fileType: FileTypes;
    createdAt: Date;
  }[];
};
export default function useResourcesQuery({
  parentResourceId,
}: {
  parentResourceId?: string;
}) {
  const resourceQuery = useQuery({
    queryFn: async () => {
      const response = await API.get<APISuccessResponse<ResourceSummary>>(
        parentResourceId
          ? `/resources?parentResourceId=${parentResourceId}`
          : "/resources"
      );
      return response.data.data;
    },
    queryKey: [QUERY_KEYS.RESOURCES, parentResourceId],
  });

  const data = resourceQuery.data;
  return { data, resourceQuery };
}
