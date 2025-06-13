import QUERY_KEYS from "@/lib/queryKeys";
import type { ResourceId } from "@/lib/types";
import { useResourceStore } from "@/stores/resourceStore";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Click handler for selecting resources.
 * - Ctrl+Click toggles selection
 * - Shift+Click selects range
 * - Single click clears others and selects
 * - Double click on folder navigates into it
 */
export default function useResourceSelection(resourceIds: ResourceId[]) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    selectedIds,
    rangeSelectedIds,
    setRangeSelectedIds,
    addSelectedId,
    clearSelectedIds,
    removeSelectedId,
  } = useResourceStore();

  const [ctrlKeyIsPressed, setCtrlKeyIsPressed] = useState(false);
  const [shiftKeyIsPressed, setShiftKeyIsPressed] = useState(false);
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Control") setCtrlKeyIsPressed(true);
      if (e.key === "Shift") setShiftKeyIsPressed(true);
    };
    const handleKeyup = (e: KeyboardEvent) => {
      if (e.key === "Control") setCtrlKeyIsPressed(false);
      if (e.key === "Shift") setShiftKeyIsPressed(false);
    };
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("keyup", handleKeyup);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("keyup", handleKeyup);
    };
  }, []);

  const handleShiftSelect = (resourceId: ResourceId) => {
    if (!shiftKeyIsPressed) return;
    // Start is either the first shift selected, most recently added or the currently clicked one
    const start = rangeSelectedIds[0] || selectedIds.at(-1) || resourceId;
    const startIdx = resourceIds.indexOf(start);
    const endIdx = resourceIds.indexOf(resourceId);

    const [from, to] =
      endIdx < startIdx ? [endIdx, startIdx] : [startIdx, endIdx];

    // Set the selected range array to the new selection and mirror the results on the selectedIds array
    setRangeSelectedIds(resourceIds.slice(from, to + 1));
  };

  const handleFolderNavigation = (resourceId: ResourceId) => {
    // If there are more than one folder selected and user tries to navigate to it, select only the clicked folder and cancel navigation.
    if (selectedIds.length > 1) {
      clearSelectedIds();
      addSelectedId(resourceId);
      return;
    }

    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESOURCES] });
    clearSelectedIds();
    navigate(`/folders/${resourceId}`);
  };

  // Selects first before navigating into folder, users are required to double click to do any actions
  const handleSelect =
    (resourceId: ResourceId, type: "folder" | "file") => (e: MouseEvent) => {
      e.stopPropagation();

      // Used for options dropdown :Prevents handler from running when an element with the "ignore click" is pressed
      if ((e.target as HTMLElement).closest(".ignore-click")) return;
      const alreadySelected = selectedIds.includes(resourceId);

      // Toggle multiple folder selection with CTRL key
      if (ctrlKeyIsPressed && alreadySelected) {
        removeSelectedId(resourceId);
        return;
      }

      // Only allow 1 selection if no keys are pressed
      if (!ctrlKeyIsPressed && !shiftKeyIsPressed) {
        clearSelectedIds();
      }

      // Handle range selection with shift key
      if (shiftKeyIsPressed) {
        handleShiftSelect(resourceId);
        return;
      }

      addSelectedId(resourceId);

      // If the clicked element is a folder and is already selected
      if (type === "folder" && alreadySelected) {
        handleFolderNavigation(resourceId);
      }
    };

  const handleDropdownOpen = (resourceId: string) => (isOpen: boolean) => {
    // Allow multiple selected when shift key is pressed
    if (!ctrlKeyIsPressed) {
      clearSelectedIds();
    }

    if (isOpen && !selectedIds.includes(resourceId)) {
      addSelectedId(resourceId);
    }
  };

  return { handleDropdownOpen, handleSelect };
}
