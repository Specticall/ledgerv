import { API } from "@/lib/API";
import QUERY_KEYS from "@/lib/queryKeys";
import type { APISuccessResponse, ResourceTypes } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export type FolderInfo = {
  folder: {
    resourceId: string;
    parentResourceId: string | null;
    type: ResourceTypes;
    trueOwnerId: number;
    name: string | undefined;
  };
  path: {
    name: string;
    parentResourceId?: string;
    resourceId: string;
  }[];
};
export default function useFolderInfoQuery({
  folderResourceId,
}: {
  folderResourceId?: string;
}) {
  const folderInfoQuery = useQuery({
    queryFn: async () => {
      const response = await API.get<APISuccessResponse<FolderInfo>>(
        `/resources/folders/info/${folderResourceId}`
      );
      return response.data.data;
    },
    queryKey: [QUERY_KEYS.FOLDER_INFO, folderResourceId],
    enabled: Boolean(folderResourceId),
  });

  const data = folderInfoQuery.data;
  return { data, folderInfoQuery };
}
