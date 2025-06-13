import QUERY_KEYS from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { type APISuccessResponse } from "@/lib/types";
import { API } from "@/lib/API";

export type StorageUsageData = {
  usedStorageMB: number;
  maxStorageMB: number;
  availableStorageMB: number;
};

export default function useStorageUsageQuery() {
  const storageUsageQuery = useQuery({
    queryFn: () =>
      API.get<APISuccessResponse<StorageUsageData>>("/storages/usage"),
    queryKey: [QUERY_KEYS.STORAGE_USAGE],
  });

  const storageUsageData = storageUsageQuery.data?.data.data;

  return { storageUsageData, storageUsageQuery };
}
