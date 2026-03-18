import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { verifyOtpThunk } from "@/features/auth/authThunks";
import { selectAuthError, selectAuthLoading } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email: string })?.email;

  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const result = await dispatch(verifyOtpThunk({ email, code: otp }));
    if (verifyOtpThunk.fulfilled.match(result)) {
      navigate("/auth/reset-password", { state: { email } });
    }
  };

  return (
    <div className="flex items-center justify-center py-20 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-2xl shadow-primary/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Verify OTP</h1>
          <p className="text-muted-foreground">
            We've sent a 6-digit verification code to
            <br />
            <span className="font-semibold text-foreground">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              className="gap-2"
            >
              <InputOTPGroup className="gap-2">
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="w-12 h-14 text-xl border-2 border-border rounded-xl focus:border-primary transition-all bg-background shadow-sm"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center space-y-4">
          <div className="text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <Link
              to="/auth/forgot-password"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Resend OTP
            </Link>
          </div>
          <Link
            to="/auth/login"
            className="inline-block text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
