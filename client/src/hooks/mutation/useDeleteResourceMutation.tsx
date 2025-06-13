import { useDialog } from "@/components/ui/Dialog";
import { API } from "@/lib/API";
import QUERY_KEYS from "@/lib/queryKeys";
import type { ResourceId } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useDeleteResourceMutation() {
  const dialog = useDialog();
  const queryClient = useQueryClient();
  const deleteResourceMutation = useMutation({
    mutationFn: (data: {
      resourceId: ResourceId;
      parentResourceId?: ResourceId;
    }) => {
      return API.delete(`/resources/${data.resourceId}`);
    },
    onMutate: () => {
      const toastId = toast.loading("Deleting Item, Please Wait...");
      dialog.close();
      return { toastId };
    },
    onSuccess: (_, { parentResourceId }, { toastId }) => {
      toast.dismiss(toastId);
      toast.success("Successfuly Deleted Item");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RESOURCES, parentResourceId],
      });
    },
    onError: (_, __, context) => {
      toast.dismiss(context?.toastId);
      toast.error("Oops, Something Went Wrong!");
    },
  });

  return deleteResourceMutation;
}
