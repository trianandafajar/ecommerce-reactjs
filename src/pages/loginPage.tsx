import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchCurrentUserThunk, loginThunk } from "@/features/auth/authThunks";
import { selectAuthError, selectAuthLoading } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("password");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const [localError, setLocalError] = useState<string | null>(null);

  const validate = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) return "Email is required";
    if (!trimmedPassword) return "Password is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) return "Invalid email format";

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

    const result = await dispatch(loginThunk({ email, password }));

    if (loginThunk.fulfilled.match(result)) {
      const currentUserResult = await dispatch(fetchCurrentUserThunk());
      const role = loginThunk.fulfilled.match(result)
        ? result.payload?.user?.role ??
          (fetchCurrentUserThunk.fulfilled.match(currentUserResult)
            ? currentUserResult.payload?.role
            : undefined)
        : undefined;

      navigate(role === "admin" ? "/admin" : "/my");
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-500">
        <div className="border-b border-border bg-muted/30 px-8 py-6">
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
            Keysthetix access
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Sign in to continue shopping and tracking your orders.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-8">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-muted-foreground"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-2xl border-border bg-background px-4 text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-primary/30"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-muted-foreground"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-2xl border-border bg-background px-4 text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-primary/30"
              placeholder="••••••••"
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
            className="h-12 w-full rounded-2xl bg-primary font-semibold text-primary-foreground shadow-none transition-colors hover:bg-primary/90"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="border-t border-border px-8 py-6 text-center space-y-4">
          <Link
            to="/auth/forgot-password"
            className="block text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Forgot your password?
          </Link>
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/auth/register"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              Register
            </Link>
          </div>
          <Link
            to="/"
            className="inline-block mt-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            &larr; Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
