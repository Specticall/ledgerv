import useResourcesQuery from "@/hooks/queries/useResourcesQuery";
import { useParams } from "react-router-dom";
import { useResourceStore } from "@/stores/resourceStore";
import ResourceGrid from "./ResourceGrid";

export default function ResourceViewer() {
  const { clearSelectedIds } = useResourceStore();
  const { resourceId } = useParams();
  const { data, resourceQuery } = useResourcesQuery({
    parentResourceId: resourceId,
  });

  return (
    <div
      className="bg-base-primary border border-border rounded-md flex-1 w-full p-8"
      // Deselect when clicking outside the folder
      onClick={() => clearSelectedIds()}
    >
      <ResourceGrid resources={data} isLoading={resourceQuery.isPending} />
    </div>
  );
}
