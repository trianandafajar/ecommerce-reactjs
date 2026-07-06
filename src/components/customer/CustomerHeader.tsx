import { Link } from "react-router-dom";
import { useSidebar } from "@/context/SidebarContext";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectUser, selectUserRole } from "@/features/auth/authSlice";
import { logoutThunk } from "@/features/auth/authThunks";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, LayoutDashboard, LogOut, Menu, PackageSearch, ShoppingCart, UserRound } from "lucide-react";

export default function CustomerHeader() {
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const role = useAppSelector(selectUserRole) ?? "customer";

  const dashboardPath = role === "admin" ? "/admin/dashboard" : "/my/dashboard";
  const profilePath = role === "admin" ? "/admin/profile" : "/my/profile";
  const handleLogout = () => {
    void dispatch(logoutThunk());
  };

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="flex flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleToggle}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-800 bg-slate-900 text-slate-200 lg:h-11 lg:w-11"
            aria-label="Toggle customer sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/products">
            <Button variant="outline" className="h-10 rounded-md border-slate-700 bg-slate-900 text-white hover:bg-slate-800">
              <PackageSearch className="mr-2 h-4 w-4" />
              Products
            </Button>
          </Link>
          <Link to="/cart">
            <Button variant="outline" className="h-10 rounded-md border-slate-700 bg-slate-900 text-white hover:bg-slate-800">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart
            </Button>
          </Link>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-3 rounded-md border border-slate-800 bg-slate-900 px-3 py-2 transition-colors hover:border-cyan-400/20 hover:bg-cyan-400/10"
                aria-label="Open profile menu"
              >
                <Avatar className="h-9 w-9 border border-cyan-400/20 bg-slate-900">
                  <AvatarFallback className="bg-cyan-400/10 text-sm font-semibold text-cyan-300">
                    {user?.name ? user.name.slice(0, 1).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden min-w-0 lg:block">
                  <p className="truncate text-xs uppercase tracking-[0.28em] text-slate-500">Profile</p>
                  <p className="truncate text-sm font-medium text-white">{user?.name ?? "User"}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              sideOffset={10}
              className="w-72 overflow-hidden rounded-md border border-slate-800 bg-slate-950 p-0 text-white shadow-xl"
            >
              <div className="border-b border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-slate-700 bg-slate-900">
                    <AvatarFallback className="bg-cyan-400/10 text-base font-bold text-cyan-300">
                      {user?.name ? user.name.slice(0, 1).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{user?.name ?? "User"}</p>
                    <p className="truncate text-xs text-slate-400">{user?.email ?? "customer@store.local"}</p>
                    <span className="mt-2 inline-flex rounded-md bg-cyan-400/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-cyan-300">
                      {role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <Link to={dashboardPath} className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 text-slate-300">
                    <LayoutDashboard className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Dashboard</p>
                    <p className="text-xs text-slate-500">Open role dashboard</p>
                  </div>
                </Link>

                <Link to={profilePath} className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 text-slate-300">
                    <UserRound className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Profile</p>
                    <p className="text-xs text-slate-500">Open account profile</p>
                  </div>
                </Link>

                <div className="my-2 h-px bg-slate-800" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-red-500/10 text-red-400">
                    <LogOut className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Logout</p>
                    <p className="text-xs font-normal text-red-500/70">End current session</p>
                  </div>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
