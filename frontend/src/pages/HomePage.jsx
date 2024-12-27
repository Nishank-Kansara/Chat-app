import { useState, useEffect } from "react";
import { useChatStore } from "../Store/useChatStore.js";
import { useAuthStore } from "../Store/useAuthStore.js";


import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser} = useChatStore();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const {onlineUsers}=useAuthStore();

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth < 640; // Tailwind's `sm` breakpoint

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* Sidebar */}
            {isMobile && selectedUser ? null : <Sidebar />}

            {/* Chat Area */}
            {!selectedUser ? (isMobile ? null:<NoChatSelected />) : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
