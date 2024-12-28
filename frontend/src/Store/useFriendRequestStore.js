import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useFriendRequestStore = create((set, get) => ({
  friendRequests: [], // All friend requests
  isLoading: false, // Loading state
  sentFriendRequest: JSON.parse(localStorage.getItem("sentFriendRequest")) || [], // Load from localStorage

  // Fetch all friend requests
  fetchFriendRequests: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/friendrequests");
      set({ friendRequests: res.data });
    } catch (error) {
      console.error("Error fetching friend requests:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch friend requests");
    } finally {
      set({ isLoading: false });
    }
  },

  // Send a friend request
  sendFriendRequest: async (receiverId) => {
    const { sentFriendRequest } = get();
    try {
      // Add the receiverId to the sentFriendRequest array
      const updatedSentRequests = [...sentFriendRequest, receiverId];
      set({ sentFriendRequest: updatedSentRequests });

      // Save to localStorage
      localStorage.setItem("sentFriendRequest", JSON.stringify(updatedSentRequests));

      await axiosInstance.post("/friendrequests/send", { receiverId });
      toast.success("Friend request sent successfully!");
    } catch (error) {
      console.error("Error sending friend request:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to send friend request");
    }
  },

  // Respond to a friend request (accept/decline)
  respondToFriendRequest: async (requestId, status) => {
    const { sentFriendRequest } = get();
    try {
      await axiosInstance.post("/friendrequests/respond", { requestId, status });
      toast.success(`Friend request ${status} successfully!`);

      // Remove the request from the list of friend requests
      set({
        friendRequests: get().friendRequests.filter((req) => req._id !== requestId),
      });

      // If the request was accepted or declined, remove the sender's ID from sentFriendRequest in localStorage
      const updatedSentRequests = sentFriendRequest.filter((id) => id !== requestId);  // Assuming `requestId` is the same as `receiverId` here
      set({ sentFriendRequest: updatedSentRequests });

      // Update localStorage
      localStorage.setItem("sentFriendRequest", JSON.stringify(updatedSentRequests));

    } catch (error) {
      console.error("Error responding to friend request:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to respond to friend request");
    }
  },
}));
