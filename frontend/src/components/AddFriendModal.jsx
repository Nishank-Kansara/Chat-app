import React, { useState, useEffect } from "react";
import { useChatStore } from "../Store/useChatStore";
import { useFriendRequestStore } from "../Store/useFriendRequestStore";

const AddFriendModal = ({ isOpen, closeModal }) => {
  const { users, getUsers, getFriendUsers, friendUsers } = useChatStore(); // Fetch all users and friend users
  const { sendFriendRequest, sentFriendRequest, friendRequests } = useFriendRequestStore(); // Friend requests

  const [searchQuery, setSearchQuery] = useState(""); // For search

  useEffect(() => {
    if (isOpen) {
      getUsers(); // Fetch all users
      getFriendUsers(); // Fetch friends
    }
  }, [isOpen, getUsers, getFriendUsers]);

  const handleSendRequest = (userId) => {
    sendFriendRequest(userId); // Send friend request
  };

  // Get IDs of friends, pending friend requests, and sent friend requests
  const friendIds = friendUsers.map((friend) => friend._id);
  const pendingRequestIds = friendRequests.map((req) => req.receiver._id);

  // Filter users for the search query, excluding friends, pending requests, and those who have already sent a request
  const filteredUsers = users.filter(
    (user) =>
      !friendIds.includes(user._id) && // Exclude current friends
      !pendingRequestIds.includes(user._id) && // Exclude pending friend requests
      !sentFriendRequest.includes(user._id) && // Exclude those who have already sent a request
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) // Match search query
  );

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        {/* Backdrop */}
        <div className="absolute inset-0 " onClick={closeModal}></div>
        
        {/* Modal Content */}
        <div className="relative rounded-lg shadow-lg w-full max-w-md p-4 ">
          <h2 className="text-lg font-bold mb-4">Add Friend</h2>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full mb-4"
          />
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user._id} className="flex items-center justify-between p-2 border-b">
                <img
                  src={user.profilePic || "/avatar.png"} // Fallback to default image if no profile pic
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium">{user.fullName}</p>
                </div>
                <button
                  className="btn btn-xs btn-primary"
                  onClick={() => handleSendRequest(user._id)}
                >
                  Send
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No users found</p>
          )}
          <button className="btn btn-sm btn-secondary mt-4 w-full" onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default AddFriendModal;
