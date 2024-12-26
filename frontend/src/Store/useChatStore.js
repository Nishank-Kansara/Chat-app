import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // Fetch the list of users
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      console.error("Error fetching users:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Fetch messages for the selected user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      console.log("Fetching messages for user:", userId);
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
      console.log("Messages fetched:", res.data);
    } catch (error) {
      console.error("Error fetching messages:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      console.log("Stopping loading state");
      set({ isMessagesLoading: false });
    }
  },

  // Send a new message
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] }); // Add the new message to the state
      console.log("Message sent:", res.data);
    } catch (error) {
      console.error("Error sending message:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },
  subscribeToMessages:()=>{
    const {selectedUser}=get();
    if(!selectedUser)
      return;
    const socket=useAuthStore.getState().socket;

    socket.on("newMessage",(newMessage)=>{
      const isMessageSentFromSelectedUser=newMessage.senderId===selectedUser._id;
      if(!isMessageSentFromSelectedUser)return;
      set({
        messages:[...get().messages,newMessage],
      });
    });
  },

  unsubscribeFromMessages:()=>{
    const socket=useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // Set the currently selected user
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
    console.log("Selected user set:", selectedUser);
  },
  
}));
