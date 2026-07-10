import { useSidebar } from "@/context/SidebarContext";
import { ChevronDownIcon, LayoutDashboard, PackageSearch, History, UserRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/my/dashboard", icon: LayoutDashboard },
  { name: "Orders", path: "/my/orders", icon: PackageSearch },
  { name: "History", path: "/my/history", icon: History },
  { name: "Profile", path: "/my/profile", icon: UserRound },
];

export default function CustomerSidebar() {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-card px-4 text-foreground transition-all duration-300 ease-in-out
        ${isExpanded || isMobileOpen || isHovered ? "w-[280px]" : "w-[84px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex items-center gap-3 py-4 ${!isExpanded && !isHovered ? "justify-center" : "justify-start"}`}>
        <Link to="/" className="flex items-center gap-3">
          <img src="/icon.svg" alt="Keysthetix logo" className="h-11 w-11 shrink-0" />
          {(isExpanded || isHovered || isMobileOpen) && (
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-foreground">Keysthetix</p>
            </div>
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto pb-6">
        <nav className="mt-2">
          <p className={`mb-3 px-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground ${!isExpanded && !isHovered ? "text-center" : ""}`}>
            {(isExpanded || isHovered || isMobileOpen) ? "Menu" : <ChevronDownIcon className="mx-auto h-4 w-4" />}
          </p>

          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 rounded-md border px-3 py-3 text-sm transition-colors
                      ${active ? "border-primary/20 bg-primary/10 text-primary" : "border-transparent text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground"}
                      ${!isExpanded && !isHovered ? "justify-center" : "justify-start"}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {(isExpanded || isHovered || isMobileOpen) && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
