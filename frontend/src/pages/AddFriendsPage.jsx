import React, { useEffect, useState } from "react";
import { useFriendRequestStore } from "../Store/useFriendRequestStore";
import { useChatStore } from "../Store/useChatStore";
import { useNavigate } from "react-router-dom"; // For navigation
import { User } from 'lucide-react'; // Importing the icon for user
import AuthImagePattern from '../components/AuthImagePattern.jsx'; // For the image pattern

const AddFriendsPage = () => {
  const { fetchFriendRequests, sendFriendRequest } = useFriendRequestStore();
  const { users, getUsers, isUsersLoading } = useChatStore();
  const [searchQuery, setSearchQuery] = useState(""); // For search
  const [sentRequests, setSentRequests] = useState(new Set()); // Track sent requests

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    fetchFriendRequests();
    getUsers();
  }, [fetchFriendRequests, getUsers]);

  const handleSendRequest = (userId) => {
    sendFriendRequest(userId);
    setSentRequests((prev) => new Set(prev.add(userId))); // Add user to sent requests
  };

  // Filter users based on the search query
  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle continue button click to redirect to homepage
  const handleContinue = () => {
    navigate("/"); // Redirect to homepage
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <User className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Add Friends</h1>
              <p className="text-base-content/60">Find and add friends to your network</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="form-control mb-6">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          {/* Scrollable User List */}
          <div className="overflow-y-auto max-h-64 space-y-2 border rounded-lg p-2">
            {isUsersLoading ? (
              <p className="text-center">Loading users...</p>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="p-2 border rounded flex items-center justify-between"
                >
                  <img
                  src={user.profilePic|| "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />
                  <span className="font-medium">{user.fullName}</span>
                  {!sentRequests.has(user._id) ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleSendRequest(user._id)}
                    >
                      Send
                    </button>
                  ) : (
                    <span className="text-green-600 text-sm">Request Sent</span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No users found</p>
            )}
          </div>

          {/* Continue Button */}
          <button
            className="btn btn-secondary mt-4 w-full"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>

      {/* Right Side Image Pattern */}
      <AuthImagePattern
        title="Connect with friends"
        subtitle="Find and connect with people you know"
      />
    </div>

  );
};

export default AddFriendsPage;
