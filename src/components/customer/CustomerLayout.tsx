import { Outlet } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import Backdrop from "@/components/layout/Backdrop";
import CustomerHeader from "./CustomerHeader";
import CustomerSidebar from "./CustomerSidebar";

function CustomerShell() {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[280px]"
      : "lg:ml-[84px]";

  return (
    <div className="min-h-screen bg-slate-950 xl:flex">
      <CustomerSidebar />
      <Backdrop />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
        <CustomerHeader />
        <div className="mx-auto w-full max-w-[1600px] p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function CustomerLayout() {
  return (
    <SidebarProvider>
      <CustomerShell />
    </SidebarProvider>
  );
}

