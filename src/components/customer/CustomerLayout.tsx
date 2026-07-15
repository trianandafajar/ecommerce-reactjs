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
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground xl:flex">
      <CustomerSidebar />
      <Backdrop />
      <div className={`min-w-0 flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
        <CustomerHeader />
        <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-5 md:p-6">
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
