import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { verifyOtpThunk } from "@/features/auth/authThunks";
import { selectAuthError, selectAuthLoading } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
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
    <div className="bg-white min-h-screen">
      <Header />

      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-black mb-2">Verify OTP</h1>
            <p className="text-gray-600">
              Enter the 6-digit code sent to {email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mx-auto">
            <InputOTP
              className="mx-auto"
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup className="flex justify-center gap-8">
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="w-12 h-12 text-xl border rounded-md flex items-center justify-center"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-black text-white"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-gray-600 hover:text-black"
            >
              Resend OTP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
