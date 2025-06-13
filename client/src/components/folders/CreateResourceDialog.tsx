import { Button } from "../ui/Button";
import Input from "../ui/Input";
import { useState, type FormEvent } from "react";
import { useDialog, useDialogContext } from "../ui/Dialog";
import type { CreateResourceDialogContext } from "@/pages/PageFolder";
import useCreateFolderMutation from "@/hooks/mutation/useCreateFolderMutation";

export default function CreateResourceDialog() {
  // Current open folder id is stored on :folderId url params.
  const { resourceId } = useDialogContext<CreateResourceDialogContext>();
  const dialog = useDialog();

  const createFolderMutation = useCreateFolderMutation();
  const [name, setName] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createFolderMutation.mutate({ name, parentResourceId: resourceId || "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-secondary border border-border p-6 rounded-md w-full max-w-[30rem]"
    >
      <h2 className="text-xl mb-1">New Folder</h2>
      <p className="mb-4 text-secondary">
        Create a new folder with the following name
      </p>
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
          Create
        </Button>
      </div>
    </form>
  );
}
