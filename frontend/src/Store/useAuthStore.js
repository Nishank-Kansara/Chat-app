import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE==="development"?"http://localhost:5001":"/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  loginEmail:null,

  // Check if user is authenticated
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket(); // Connect socket after successful auth
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Signup function
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login function
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Logout function
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      get().disconnectSocket(); // Disconnect socket on logout
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  // Update user profile
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Connect socket
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
  sendPasswordReset: async (email) => {
    try {
      await axiosInstance.post("/auth/forget-password", { email });
      toast.success("OTP sent to your email!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  },
  verifyOTP: async (email, otp) => {
    try {
      await axiosInstance.post("/auth/verify-otp", { email, otp });
      toast.success("OTP verified successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
      throw error;
    }
  },
  resetPassword: async (email, newPassword) => {
    try {
      await axiosInstance.post("/auth/reset-password", { email, newPassword });
      toast.success("Password reset successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
      throw error;
    }
  },
  setloginEmail:(email)=>{
    set({loginEmail:email});
  }
}));
