import Sidebar from "@/components/layout/Sidebar";
import SideNavigation from "@/components/layout/SideNavigation";
import { Outlet } from "react-router-dom";

export default function PageLayout() {
  return (
    <div className="min-h-screen grid grid-cols-[auto_20rem_1fr]">
      <SideNavigation />
      <Sidebar />
      <Outlet />
    </div>
  );
}
