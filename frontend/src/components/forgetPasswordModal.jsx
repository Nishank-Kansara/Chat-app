import { useState } from "react";
import { useAuthStore } from "../Store/useAuthStore";
import { Mail, Loader2, Lock } from "lucide-react";

const ForgetPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for re-entering password
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [isLoading, setIsLoading] = useState(false);

  const { sendPasswordReset, verifyOTP, resetPassword } = useAuthStore();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendPasswordReset(email);
      setStep(2);
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await verifyOTP(email, otp);
      setStep(3);
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword(email, newPassword);
      onClose();
    } catch (error) {
      console.error("Error resetting password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          {step === 1 ? "Reset Password" : step === 2 ? "Enter OTP" : "New Password"}
        </h3>

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="modal-action">
              <button type="button" className="btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Enter OTP</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                required
                maxLength={6}
              />
              <label className="label">
                <span className="label-text-alt">
                  Check your email for the OTP code
                </span>
              </label>
            </div>

            <div className="modal-action">
              <button type="button" className="btn" onClick={() => setStep(1)}>
                Back
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="password"
                  className="input input-bordered w-full pl-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Re-enter New Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="password"
                  className="input input-bordered w-full pl-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="modal-action">
              <button type="button" className="btn" onClick={() => setStep(2)}>
                Back
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgetPasswordModal;
