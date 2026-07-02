import { ShieldCheck, UserRound } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { selectUser, selectUserRole } from "@/features/auth/authSlice";

function getInitials(name?: string) {
  if (!name) return "AD";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function ProfilePage() {
  const user = useAppSelector(selectUser);
  const role = useAppSelector(selectUserRole);

  const profileName = user?.name ?? "Administrator";
  const profileEmail = user?.email ?? "admin@store.local";
  const profilePhone = user?.phone ?? "-";
  const profileRole = role ?? "admin";
  const profileStatus = user?.is_active === false ? "Inactive" : "Active";

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Profile</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Account information</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Data ditarik dari akun login yang aktif, jadi tampilannya mengikuti user asli.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-lg font-semibold text-[#00A9AA]">
              {getInitials(profileName)}
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{profileName}</p>
              <p className="text-sm text-slate-400">{profileEmail}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.28em] text-[#00A9AA]">
                {profileRole}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <ShieldCheck className="h-4 w-4 text-[#00A9AA]" />
              Account status
            </div>
            <p className="mt-3 text-sm text-white">{profileStatus}</p>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Name</p>
              <p className="mt-2 text-white">{profileName}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Email</p>
              <p className="mt-2 text-white">{profileEmail}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Phone</p>
              <p className="mt-2 text-white">{profilePhone}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Role</p>
              <p className="mt-2 text-white">{profileRole}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <UserRound className="h-4 w-4 text-[#00A9AA]" />
              This page uses the active auth state
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Nama, email, role, dan status diambil dari data login yang sedang aktif.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
