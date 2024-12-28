import { useEffect, useState } from "react";
import { useChatStore } from "../Store/useChatStore";
import { useAuthStore } from "../Store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search } from "lucide-react";

const Sidebar = ({ isMobileView, showSidebar }) => {
  const { friendUsers, selectedUser, setSelectedUser, isUsersLoading, getFriendUsers } = useChatStore(); // Ensure getFriendUsers is in your store
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    getFriendUsers(); // Fetch friend users when Sidebar mounts
  }, [getFriendUsers]);

  // Filter the friends list based on the search query and online status
  const filteredUsers = friendUsers
    .filter((user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    ) // Filter users by search query
    .filter((user) => (showOnlineOnly ? onlineUsers.includes(user._id) : true)); // Apply online filter

  if (isUsersLoading) return <SidebarSkeleton />; // Show loading skeleton while users are being fetched

  return (
    <aside
      className={`h-full w-full lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 ${isMobileView && !showSidebar ? "hidden" : "block"}`}
    >
      {/* Header Section */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Online Only Toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
            className="input input-bordered w-full pl-10 text-sm"
          />
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}  // This sets the selected user
              className={`w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}
            >
              <div className="relative md:mr-1">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {/* User Info */}
              <div className="lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-zinc-500 py-4">You Need to select the friend</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
