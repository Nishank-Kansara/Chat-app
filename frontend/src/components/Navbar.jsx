import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../Store/useAuthStore";
import { useFriendRequestStore } from "../Store/useFriendRequestStore";
import { useChatStore } from "../Store/useChatStore";
import { MessageSquare, Settings, User, LogOut, Bell, UserPlus } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { friendRequests, fetchFriendRequests, isLoading: isFriendRequestLoading } = useFriendRequestStore();
  const { users, getUsers } = useChatStore();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) { // Only fetch data if user is logged in
      fetchFriendRequests();
      getUsers();
    }
  }, [authUser, fetchFriendRequests, getUsers]);

  const handleAddFriend = () => {
    navigate("/add-friends-modal");
  };

  const handleFriendRequests = () => {
    navigate("/friend-requests");
  };

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-[3.3rem]">
        <div className="flex items-center justify-between h-full">
          {/* Logo and Home Link */}
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold">JChats</h1>
          </Link>

          {/* Right Side (Friend Requests, Add Friend, Settings, Profile, Logout) */}
          <div className="flex items-center gap-2">
            {authUser && (
              <>
                {/* Friend Requests Button */}
                <button
                  className="relative btn btn-sm gap-2"
                  onClick={handleFriendRequests}
                >
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                  {friendRequests.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-error text-white rounded-full flex items-center justify-center">
                      {friendRequests.length}
                    </span>
                  )}
                  <span className="hidden sm:inline">Requests</span>
                </button>

                {/* Add Friend Button */}
                <button
                  className="btn btn-sm gap-2"
                  onClick={handleAddFriend}
                >
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Add Friend</span>
                </button>
              </>
            )}

            {/* Settings */}
            <Link to="/settings" className="btn btn-sm gap-2 transition-colors">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser ? (
              <>
                {/* Profile */}
                <Link to="/profile" className="btn btn-sm gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                {/* Logout */}
                <button
                  className="btn btn-sm gap-2 bg-error/10 hover:bg-error/20 text-error"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
