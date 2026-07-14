import React from "react";
import Sidebar from "./dashboard/sidebar/Sidebar";
import DashboardHeader from "../../component/layout/dashboard/DashboardHeader";
import { Outlet, useLocation } from "react-router-dom";

const getRoleFromPath = (pathname) => {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/subadmin")) return "subadmin";
  return "user";
};

const DashboardLayout = () => {
  const location = useLocation();
  const role = getRoleFromPath(location.pathname);

  return (
    <div className="flex bg-[var(--whiold-bg-soft)] overflow-hidden h-screen">
      <div className="">
        <Sidebar role={role} />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="sticky top-0 z-10">
          <DashboardHeader />
        </div>
        <div className="flex-1 overflow-y-auto p-2 overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;