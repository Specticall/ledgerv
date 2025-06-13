import { create } from "zustand";
import { type ResourceId } from "@/lib/types";

type ResourceStore = {
  selectedIds: ResourceId[];
  rangeSelectedIds: ResourceId[];
  addSelectedId: (id: ResourceId) => void;
  removeSelectedId: (id: ResourceId) => void;
  clearSelectedIds: () => void;
  addManySelectedIds: (ids: ResourceId[]) => void;
  removeManySelectedIds: (ids: ResourceId[]) => void;
  setRangeSelectedIds: (id: ResourceId[]) => void;
};

const useResourceStore = create<ResourceStore>((set) => ({
  selectedIds: [],
  rangeSelectedIds: [],
  rangeSelectStart: undefined,
  rangeSelectEnd: undefined,
  addSelectedId: (id: ResourceId) => {
    return set((state) => ({
      ...state,
      selectedIds: [...state.selectedIds, id],
    }));
  },
  removeSelectedId: (selectedId: ResourceId) => {
    return set((state) => ({
      ...state,
      selectedIds: state.selectedIds.filter((id) => id !== selectedId),
    }));
  },
  clearSelectedIds: () => {
    return set((state) => ({
      ...state,
      rangeSelectStart: undefined,
      selectedIds: [],
      rangeSelectedIds: [],
    }));
  },
  addManySelectedIds: (ids: ResourceId[]) => {
    return set((state) => ({
      ...state,
      selectedIds: [...state.selectedIds, ...ids],
    }));
  },
  removeManySelectedIds: (ids: ResourceId[]) => {
    return set((state) => ({
      ...state,
      selectedIds: state.selectedIds.filter((id) => ids.includes(id)),
    }));
  },
  setRangeSelectedIds: (ids: ResourceId[]) => {
    return set((state) => ({
      ...state,
      rangeSelectedIds: ids,
      selectedIds: [
        // Filters ids that does not come from the range selection
        ...state.selectedIds.filter(
          (id) => !state.rangeSelectedIds.includes(id)
        ),
        // Combined with the newly added range ids
        ...ids,
      ],
    }));
  },
}));

export { useResourceStore };
