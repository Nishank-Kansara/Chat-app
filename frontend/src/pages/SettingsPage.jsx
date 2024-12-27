import React, { useState } from 'react';
import { useThemeStore } from '../Store/useThemeStore.js';
import { THEMES } from '../constants';
import { Send, Lock } from 'lucide-react';
import { useAuthStore } from '../Store/useAuthStore.js';


const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey!! How's it going??", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { resetPassword, loginEmail, authUser } = useAuthStore();

  const handleResetPassword = () => {
    // Password validation regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    // Confirm new password matches
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    // Validate fields are filled
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required.');
      return;
    }

    // Ensure new password is different from the old one
    if (oldPassword === newPassword) {
      toast.error('New password must be different from the old password.');
      return;
    }

    // Validate password complexity
    if (!passwordRegex.test(newPassword)) {
      toast.error(
        'New password must be at least 6 characters long, and include at least one uppercase letter, one lowercase letter, and one digit.'
      );
      return;
    }



    // Trigger password reset API
    resetPassword(loginEmail, newPassword)
      .then(() => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsModalOpen(false);
        toast.success('Password reset successfully!');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  console.log(loginEmail);

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-8">
        {/* Theme Section */}
        <div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Theme</h2>
            <p className="text-sm text-base-content/70">
              Choose a theme for your chat interface
            </p>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mt-4">
            {THEMES.map((t) => (
              <button
                key={t}
                className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${theme === t ? 'bg-base-200' : 'hover:bg-base-200/50'
                  }`}
                onClick={() => setTheme(t)}
              >
                <div
                  className="relative h-8 w-full rounded-md overflow-hidden"
                  data-theme={t}
                >
                  <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                    <div className="rounded bg-primary"></div>
                    <div className="rounded bg-secondary"></div>
                    <div className="rounded bg-accent"></div>
                    <div className="rounded bg-neutral"></div>
                  </div>
                </div>
                <span className="text-[11px] font-medium truncate w-full text-center">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Reset Password Button */}
        {authUser &&
          (<div>
            <h3 className="text-lg font-semibold">Account Settings</h3>
            <button
              className="btn btn-outline btn-primary mt-4"
              onClick={() => setIsModalOpen(true)}
            >
              Reset Password
            </button>
          </div>)
        }

        {/* Preview Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Preview</h3>
          <div className="rounded-xl border border-base-300 bg-base-100 shadow-lg overflow-hidden">
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-base-300 bg-base-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                  J
                </div>
                <div>
                  <h3 className="font-medium text-sm">John Doe</h3>
                  <p className="text-xs text-base-content/70">Online</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
              {PREVIEW_MESSAGES.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isSent ? 'justify-end' : 'justify-start'
                    }`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-3 shadow-sm ${message.isSent
                      ? 'bg-primary text-primary-content'
                      : 'bg-base-200'
                      }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-[10px] mt-1.5 ${message.isSent
                        ? 'text-primary-content/70'
                        : 'text-base-content/70'
                        }`}
                    >
                      12:00 PM
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-base-300 bg-base-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input input-bordered flex-1 text-sm h-10"
                  placeholder="Type a message..."
                  value="This is a preview"
                  readOnly
                />
                <button className="btn btn-primary h-10 min-h-0">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Reset Password</h3>
            <div className="space-y-4">
              {/* Old Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Enter Old Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type="password"
                    className="input input-bordered w-full pl-10"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter old password"
                    required
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Enter New Password</span>
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

              {/* Confirm New Password */}
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
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                className="btn btn-outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleResetPassword}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default SettingsPage;
