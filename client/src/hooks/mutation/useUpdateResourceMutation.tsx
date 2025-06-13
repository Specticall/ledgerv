import { useDialog } from "@/components/ui/Dialog";
import { API } from "@/lib/API";
import QUERY_KEYS from "@/lib/queryKeys";
import type { FileTypes, ResourceId, ResourceTypes } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UpdateFolderPayload = {
  parentResourceId: ResourceId;
  resourceId: ResourceId;
  resourceType: ResourceTypes;
  data: {
    name: string;
    fileType?: FileTypes;
  };
};
export default function useUpdateResourceMutation() {
  const dialog = useDialog();
  const queryClient = useQueryClient();
  const createFolderMutation = useMutation({
    mutationFn: ({ resourceId, resourceType, data }: UpdateFolderPayload) => {
      return API.put(`/resources/content/${resourceId}`, {
        resourceType: resourceType,
        fileType: data.fileType,
        name: data.name,
      });
    },
    onMutate: () => {
      const toastId = toast.loading("Updating Folder, Please Wait...");
      dialog.close();
      return { toastId };
    },
    onSuccess: () => {
      toast.success("Successfuly Updated Folder");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESOURCES] });
    },
    onError: () => {
      toast.error("Oops, Something Went Wrong!");
    },
    onSettled: (_, __, ___, context) => {
      toast.dismiss(context?.toastId);
    },
  });

  return createFolderMutation;
}
