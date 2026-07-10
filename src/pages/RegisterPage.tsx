import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { registerThunk } from "@/features/auth/authThunks";
import { selectAuthError, selectAuthLoading } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const [localError, setLocalError] = useState<string | null>(null);

  const validate = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName) return "Full name is required";
    if (trimmedName.length < 3) return "Name must be at least 3 characters";

    if (!trimmedEmail) return "Email address is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) return "Invalid email address format";

    if (!trimmedPassword) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const validationMsg = validate();
    if (validationMsg) {
      setLocalError(validationMsg);
      return;
    }

    const result = await dispatch(registerThunk({ name, email, phone, password }));
    if (registerThunk.fulfilled.match(result)) {
      navigate("/auth/login");
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
        <div className="text-center space-y-2">
          <div className="mb-2 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-sm">
            <UserPlus className="h-7 w-7" />
          </div>
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
            Keysthetix access
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Create account
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Join Keysthetix and keep your orders in one place.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5 p-8">
            <div className="space-y-2">
              <label className="ml-1 text-sm font-medium text-muted-foreground">
                Full Name
              </label>
              <Input
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-2xl border-border bg-background text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-primary/30"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-medium text-muted-foreground">
                Email Address
              </label>
              <Input
                placeholder="john@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-2xl border-border bg-background text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-primary/30"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-medium text-muted-foreground">
                Phone Number (Optional)
              </label>
              <Input
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 rounded-2xl border-border bg-background text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-primary/30"
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-medium text-muted-foreground">
                Password
              </label>
              <Input
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-2xl border-border bg-background text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-primary/30"
                required
              />
            </div>

            {(error || localError) && (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-center text-sm text-rose-700 dark:text-rose-200">
                {error || localError}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-4 h-12 w-full rounded-2xl bg-primary font-semibold text-primary-foreground shadow-none transition-colors hover:bg-primary/90"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="border-t border-border px-8 py-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="font-medium text-primary transition-colors hover:text-primary/80"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
