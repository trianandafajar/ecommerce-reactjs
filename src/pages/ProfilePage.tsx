import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectUser } from "@/features/auth/authSlice";
import { fetchCurrentUserThunk } from "@/features/auth/authThunks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PUT } from "@/lib/api";
import type { StandardResponse } from "@/types/api";

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

  const profileName = form.name || user?.name || "Profile";
  const profileEmail = form.email || user?.email || "";

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
      <section className="rounded-md border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-slate-700 bg-slate-950 text-xl font-semibold text-[#00A9AA]">
            {getInitials(profileName)}
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Profile</p>
            <h1 className="truncate text-2xl font-semibold text-white">{profileName}</h1>
            {profileEmail ? <p className="truncate text-sm text-slate-400">{profileEmail}</p> : null}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
