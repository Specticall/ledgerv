import type { ResourceSummary } from "@/hooks/queries/useResourcesQuery";
import { useResourceStore } from "@/stores/resourceStore";
import { useMemo } from "react";
import FolderItem from "./FolderItem";
import useResourceSelection from "@/hooks/useResourceSelection";
import Skeleton from "react-loading-skeleton";
import { useHotkeys } from "react-hotkeys-hook";

type Props = { resources?: ResourceSummary; isLoading?: boolean };
export default function ResourceGrid({ resources, isLoading }: Props) {
  const { selectedIds, addManySelectedIds, clearSelectedIds } =
    useResourceStore();
  const resourceIds = useMemo(() => {
    if (!resources) return [];
    return [
      ...resources.folders.map((f) => f.resourceId),
      ...resources.files.map((f) => f.resourceId),
    ];
  }, [resources]);

  const { handleDropdownOpen, handleSelect } =
    useResourceSelection(resourceIds);

  useHotkeys("ctrl+a", (e) => {
    e.preventDefault();
    clearSelectedIds();
    addManySelectedIds(resourceIds);
  });

  const loadingSkeletonElements = new Array(8)
    .fill("x")
    .map(() => (
      <Skeleton
        width={"100%"}
        height={"100%"}
        containerClassName="w-full block h-[60px]"
      />
    ));

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-2">
      {/* {isLoading && loadingSkeletonElements} */}
      {resources?.folders.map((folder) => {
        const isSelected = selectedIds.includes(folder.resourceId);
        // Disable if more than 1 folder is selected
        const disableDropdown =
          selectedIds.length > 1 && selectedIds.includes(folder.resourceId);
        return (
          <FolderItem
            folder={folder}
            isSelected={isSelected}
            disableDropdown={disableDropdown}
            onClick={handleSelect(folder.resourceId, "folder")}
            onOpenDropdown={handleDropdownOpen(folder.resourceId)}
          />
        );
      })}
    </div>
  );
}
