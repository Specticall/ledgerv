import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { useState, type HTMLAttributes } from "react";
import ResourceDropdown from "./ResourceDropdown";
import type { Folder } from "@/lib/types";

type Props = {
  isSelected?: boolean;
  disableDropdown?: boolean;
  onOpenDropdown?: (isOpen: boolean) => void;
  folder: Folder;
};
/**
 * Handles double click logic
 */
export default function FolderItem({
  isSelected,
  onOpenDropdown,
  disableDropdown,
  folder,
  ...props
}: Props & HTMLAttributes<HTMLDivElement>) {
  const [isDisabled, setIsDisabled] = useState(false);
  return (
    <div
      className={cn(
        "border border-border rounded-sm items-center justify-center px-4 py-3 bg-gradient-to-b from-base-secondary to-base-primary group cursor-pointer grid grid-cols-[auto_1fr_auto] gap-4 select-none",
        isDisabled && "pointer-events-none opacity-50",
        isSelected
          ? "from-white/2 border-accent"
          : "hover:from-white/1 hover:border-white/50"
      )}
      {...props}
    >
      <Icon icon="material-symbols:folder" className="text-[2rem]" />
      <p className={cn("text-secondary truncate", isSelected && "text-white")}>
        {folder.name}
      </p>
      <ResourceDropdown
        onOpenChange={onOpenDropdown}
        isDisabled={disableDropdown}
        resource={folder}
        // Revert loading state on failure
        onDelete={(failed) => setIsDisabled(failed ? false : true)}
      />
    </div>
  );
}
