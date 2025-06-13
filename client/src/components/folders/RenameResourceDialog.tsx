import { Button } from "../ui/Button";
import Input from "../ui/Input";
import { useState, type FormEvent } from "react";
import { useDialog, useDialogContext } from "../ui/Dialog";
import type { RenameResourceDialogContext } from "./ResourceDropdown";
import useUpdateResourceMutation from "@/hooks/mutation/useUpdateResourceMutation";

export default function RenameResourceDialog() {
  // Current open folder id is stored on :folderId url params.
  const { parentResourceId, resource } =
    useDialogContext<RenameResourceDialogContext>();
  const dialog = useDialog();
  const [name, setName] = useState(resource.name);

  const updateResourceMutation = useUpdateResourceMutation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateResourceMutation.mutate({
      parentResourceId: parentResourceId || "",
      resourceType: resource.type,
      resourceId: resource.resourceId,
      data: {
        name,
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-secondary border border-border p-6 rounded-md w-full max-w-[30rem]"
    >
      <h2 className="text-xl mb-1">Rename Folder</h2>
      <p className="mb-4 text-secondary">Rename this folder with a new name</p>
      <Input
        placeholder="Folder Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="flex justify-end gap-4 mt-4">
        <Button
          className="w-fit py-2 px-6"
          variant={"secondary"}
          onClick={() => dialog.close()}
        >
          Cancel
        </Button>
        <Button className="w-fit py-2 px-6" type="submit">
          Rename
        </Button>
      </div>
    </form>
  );
}
