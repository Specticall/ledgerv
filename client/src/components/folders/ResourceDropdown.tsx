import { Icon } from "@iconify/react/dist/iconify.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import useDeleteResourceMutation from "@/hooks/mutation/useDeleteResourceMutation";
import { useResourceStore } from "@/stores/resourceStore";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { useDialog } from "../ui/Dialog";
import type { DialogComponentList } from "@/dialog";
import type { ResourceId } from "@/lib/types";
import type { ResourceSummary } from "@/hooks/queries/useResourcesQuery";

type Props = {
  onOpenChange?: (value: boolean) => void;
  isDisabled?: boolean;
  resource: ResourceSummary[keyof ResourceSummary][number];
  onDelete?: (failed?: boolean) => void;
};
export type RenameResourceDialogContext = {
  parentResourceId?: ResourceId;
  resource: Props["resource"];
};
export default function ResourceDropdown({
  onOpenChange,
  isDisabled,
  resource,
  onDelete,
}: Props) {
  const { resourceId: parentResourceId } = useParams();
  const { selectedIds } = useResourceStore();
  const dialog = useDialog<DialogComponentList>();
  const deleteResourceMutation = useDeleteResourceMutation();

  const handleDelete = () => {
    if (selectedIds.length > 1) return;
    deleteResourceMutation.mutate(
      {
        resourceId: selectedIds[0],
        parentResourceId,
      },
      {
        // Notify the parent that the delete has failed
        onError: () => onDelete && onDelete(true),
      }
    );
    if (onDelete) onDelete();
  };

  const handleRename = () => {
    // Only one selected id are allowed for updates
    if (selectedIds.length > 1) return;
    dialog.open("rename-resource", {
      parentResourceId,
      resource,
    } satisfies RenameResourceDialogContext);
  };
  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger
        className={cn(
          "p-2 hover:bg-white/10 rounded-sm",
          // Disable opening menu if multiple files is selectedted
          isDisabled && "pointer-events-none"
        )}
      >
        <Icon
          icon="pepicons-pencil:dots-y"
          className={cn(
            "text-xl text-tertiary hover:text-primary",
            isDisabled && "text-white/20"
          )}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="ignore-click w-[10rem]">
        <DropdownMenuItem onClick={handleRename}>
          <Icon
            icon="ic:baseline-drive-file-rename-outline"
            className="text-xl"
          />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon icon="material-symbols:download" className="text-xl" />
          Download
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete}>
          <Icon icon="tabler:trash" className="text-xl" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
