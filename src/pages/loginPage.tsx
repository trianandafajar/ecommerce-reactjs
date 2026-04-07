import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchCurrentUserThunk, loginThunk } from "@/features/auth/authThunks";
import {
  selectAuthError,
  selectAuthLoading,
} from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function LoginPage() {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("password");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(loginThunk({ email, password }));

    if (loginThunk.fulfilled.match(result)) {
      dispatch(fetchCurrentUserThunk());
      navigate("/"); 
    }
  };

  return (
    <div className="flex items-center justify-center py-20 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-2xl shadow-primary/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your NeoKeys account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center space-y-4">
          <Link
            to="/auth/forgot-password"
            className="block text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Forgot your password?
          </Link>
          <div className="text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link
              to="/auth/register"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Register
            </Link>
          </div>
          <Link to="/" className="inline-block mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
