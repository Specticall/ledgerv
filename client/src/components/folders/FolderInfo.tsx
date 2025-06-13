import useFolderInfoQuery from "@/hooks/queries/useFolderInfoQuery";
import FolderBreadcrumbs from "./FolderBreadcrumbs";
import { useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

export default function FolderInfo() {
  const { resourceId } = useParams();
  const { data, folderInfoQuery } = useFolderInfoQuery({
    folderResourceId: resourceId,
  });
  if (folderInfoQuery.isLoading) {
    return (
      <div className="h-16">
        <Skeleton
          containerClassName="block mb-2"
          width={"8rem"}
          height={"1.75rem"}
        />
        <Skeleton width={"16rem"} height={"1.5rem"} />
      </div>
    );
  }

  const formattedBreadcrumbs =
    data?.path.map((item) => {
      return {
        name: item.name,
        link: `/folders/${item.resourceId}`,
      };
    }) || [];
  return (
    <div className="h-16">
      <h1 className="text-xl mb-2">{data?.folder.name || "Root"}</h1>
      <FolderBreadcrumbs
        items={[
          {
            link: "/folders",
            name: "Root",
          },
          ...formattedBreadcrumbs,
        ]}
      />
    </div>
  );
}
