import { useDialog } from "@/components/ui/Dialog";
import { API } from "@/lib/API";
import QUERY_KEYS from "@/lib/queryKeys";
import type { ResourceId } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CreateFolderPayload = {
  parentResourceId: ResourceId;
  name: string;
};
export default function useCreateFolderMutation() {
  const dialog = useDialog();
  const queryClient = useQueryClient();
  const createFolderMutation = useMutation({
    mutationFn: ({ parentResourceId, name }: CreateFolderPayload) => {
      return API.post("/resources", {
        parentResourceId,
        resource: {
          resourceType: "folder",
          name,
        },
      });
    },
    onMutate: () => {
      const toastId = toast.loading("Creating Folder, Please Wait...");
      dialog.close();
      return { toastId };
    },
    onSuccess: () => {
      toast.success("Successfuly Created Folder");
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
