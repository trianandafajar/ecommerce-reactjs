import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectUser, selectUserRole } from "@/features/auth/authSlice";
import { fetchCurrentUserThunk } from "@/features/auth/authThunks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PUT } from "@/lib/api";
import type { StandardResponse } from "@/types/api";
import { cn } from "@/lib/utils";

type ProfileFormState = {
  name: string;
  email: string;
  phone: string;
};

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
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const role = useAppSelector(selectUserRole);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileFormState>({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
    });
  }, [user]);

  const profileName = form.name || user?.name || "Administrator";
  const profileEmail = form.email || user?.email || "admin@store.local";
  const profileRole = role ?? "admin";
  const isActive = user?.is_active !== false;
  const profileStatus = isActive ? "Active" : "Inactive";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
      };

      const response = await PUT<StandardResponse<{ id: string } | unknown>>("auth/me", payload);
      if (response.status !== "success") {
        throw new Error(response.message || "Failed to update profile");
      }

      await dispatch(fetchCurrentUserThunk()).unwrap();
      setMessage("Profile updated successfully.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-md border border-slate-800 bg-slate-900">
        <div className="flex flex-col gap-4 border-b border-slate-800 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-slate-700 bg-slate-950 text-2xl font-semibold text-[#00A9AA]">
              {getInitials(profileName)}
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Profile</p>
              <h1 className="truncate text-2xl font-semibold text-white">{profileName}</h1>
              <p className="truncate text-sm text-slate-400">{profileEmail}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-md px-3 py-1 text-xs font-medium ring-1",
                isActive
                  ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-200 ring-emerald-400/20"
                  : "border border-rose-400/20 bg-rose-400/10 text-rose-200 ring-rose-400/20",
              )}
            >
              {profileStatus}
            </span>
            <span className="inline-flex items-center rounded-md border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-slate-800">
              {profileRole}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          {error ? (
            <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}
          {message ? (
            <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {message}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.28em] text-slate-500">Name</label>
              <Input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Your name"
                className="h-11 rounded-md border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus-visible:ring-[#00A9AA]/30"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.28em] text-slate-500">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Your email"
                className="h-11 rounded-md border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus-visible:ring-[#00A9AA]/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.28em] text-slate-500">Phone</label>
            <Input
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="Your phone number"
              className="h-11 rounded-md border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus-visible:ring-[#00A9AA]/30"
            />
          </div>

          <div className="flex items-center justify-end pt-1">
            <Button type="submit" className="bg-[#00A9AA] text-slate-950 hover:bg-[#00b8b9]" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
