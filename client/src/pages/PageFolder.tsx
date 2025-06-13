import FolderInfo from "@/components/folders/FolderInfo";
import ResourceViewer from "@/components/folders/ResourceViewer";
import { Button } from "@/components/ui/Button";
import { useDialog } from "@/components/ui/Dialog";
import type { DialogComponentList } from "@/dialog";
import { Icon } from "@iconify/react";
import { useParams } from "react-router-dom";

export type CreateResourceDialogContext = { resourceId?: string };

export default function PageFolder() {
  const { resourceId } = useParams();
  const dialog = useDialog<DialogComponentList>();
  return (
    <div className="bg-base-secondary px-2 pr-4 p-6 flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <FolderInfo />
        <Button
          className="w-fit py-2 px-6"
          onClick={() => dialog.open("create-resource", { resourceId })}
          variant={"secondary"}
        >
          <Icon icon="ic:round-plus" className="text-xl text-accent" />
          <p>Create New</p>
        </Button>
      </div>
      <ResourceViewer />
    </div>
  );
}
