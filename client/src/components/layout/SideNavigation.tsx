import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";

const navigationItems = [
  {
    path: "dashboard",
    iconName: "mingcute:grid-fill",
  },
  {
    path: "folders",
    iconName: "material-symbols:folder",
  },
];

export default function SideNavigation() {
  const { pathname } = useLocation();

  return (
    <nav className="bg-base-tertiary px-3 py-4 flex flex-col gap-4">
      {navigationItems.map((item, i) => {
        const isActivePath = pathname.includes(item.path);
        return (
          <Link
            key={i}
            to={"/" + item.path}
            className={cn(
              "bg-gradient-to-b from-base-primary to-base-secondary p-3 rounded-sm border border-border",
              isActivePath && "border-accent"
            )}
          >
            <Icon
              icon={item.iconName}
              className={cn(
                "text-secondary text-3xl",
                isActivePath && "text-accent"
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
