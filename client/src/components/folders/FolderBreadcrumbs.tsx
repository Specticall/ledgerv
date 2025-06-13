import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/Breadcrumb";
import { Icon } from "@iconify/react";
import React from "react";

type Props = {
  items: {
    link: string;
    name: string;
  }[];
};
export default function FolderBreadcrumbs({ items }: Props) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, i) => {
          return (
            <React.Fragment key={i}>
              <BreadcrumbItem>
                <Icon icon="material-symbols:folder" className="text-xl" />
                <BreadcrumbLink asChild>
                  <Link className="text-lg" to={item.link}>
                    {item.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {i !== items.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
