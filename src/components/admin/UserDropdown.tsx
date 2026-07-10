import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logoutThunk } from "@/features/auth/authThunks";
import {
  selectAuthLoading,
  selectUser,
  selectUserRole,
} from "@/features/auth/authSlice";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function getInitials(name?: string): string {
  if (!name) return "AD";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function ProfileTriggerSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-md border border-transparent px-3 py-2">
      <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
      <div className="hidden min-w-0 sm:block">
        <Skeleton className="h-4 w-24 bg-white/10" />
        <Skeleton className="mt-2 h-3 w-16 bg-white/10" />
      </div>
    </div>
  );
}

export default function UserDropdown() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const role = useAppSelector(selectUserRole);
  const loading = useAppSelector(selectAuthLoading);

  const profileName = user?.name ?? "Administrator";
  const profileEmail = user?.email ?? "admin@store.local";
  const profileRole = role ?? "admin";
  const profileStatus = user?.is_active === false ? "Inactive" : "Active";
  const isActive = profileStatus === "Active";
  const dashboardPath = profileRole === "admin" ? "/admin/dashboard" : "/my/dashboard";
  const profilePath = profileRole === "admin" ? "/admin/profile" : "/my/profile";

  const handleLogout = async (): Promise<void> => {
    await dispatch(logoutThunk());
    navigate("/auth/login");
  };

  if (loading && !user) {
    return <ProfileTriggerSkeleton />;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="group flex items-center gap-3 rounded-md border border-transparent px-3 py-2 text-left transition-colors hover:bg-accent focus-visible:border-primary/50 focus-visible:bg-accent focus-visible:outline-none"
          aria-label="Open profile menu"
        >
          <Avatar className="h-10 w-10 border border-border bg-card">
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {getInitials(profileName)}
            </AvatarFallback>
          </Avatar>

          <div className="hidden min-w-0 text-left sm:block">
            <p className="max-w-[140px] truncate text-sm font-semibold text-foreground">
              {profileName}
            </p>
            <p className="max-w-[140px] truncate text-xs capitalize text-muted-foreground">
              {profileRole}
            </p>
          </div>

          <ChevronDown className="hidden h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 sm:block" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="z-[99999] w-80 overflow-hidden rounded-md border border-border bg-card p-0 text-foreground shadow-xl"
      >
        <div className="border-b border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border border-border bg-background">
              <AvatarFallback className="bg-primary/10 text-base font-bold text-primary">
                {getInitials(profileName)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {profileName}
              </p>
              <p className="truncate text-xs text-muted-foreground">{profileEmail}</p>

              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                  {profileRole}
                </span>

                <span
                  className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {profileStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-2">
          <button
            type="button"
            onClick={() => navigate(dashboardPath)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <UserRound className="h-4 w-4" />
            </span>

            <div>
              <p className="text-sm font-semibold text-foreground">
                Dashboard
              </p>
              <p className="text-xs text-muted-foreground">Open role dashboard</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate(profilePath)}
            className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <UserRound className="h-4 w-4" />
            </span>

            <div>
              <p className="text-sm font-semibold text-foreground">
                Profile
              </p>
              <p className="text-xs text-muted-foreground">Open account profile</p>
            </div>
          </button>

          <div className="my-2 h-px bg-border" />

          <Button
            type="button"
            variant="ghost"
            className="flex h-auto w-full justify-start gap-3 rounded-md px-3 py-3 text-left text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 focus-visible:bg-red-500/10 focus-visible:outline-none"
            onClick={() => {
              void handleLogout();
            }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-red-500/10 text-red-400">
              <LogOut className="h-4 w-4" />
            </span>

            <div>
              <p className="text-sm font-semibold">Logout</p>
              <p className="text-xs font-normal text-red-500/70">
                End current session
              </p>
            </div>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
