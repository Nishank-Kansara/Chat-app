import React, { useEffect } from 'react';
import { useFriendRequestStore } from '../Store/useFriendRequestStore';

const FriendRequestsModal = ({ isOpen, closeModal }) => {
  const { friendRequests, fetchFriendRequests, respondToFriendRequest, isLoading } = useFriendRequestStore();

  useEffect(() => {
    if (isOpen) {
      fetchFriendRequests(); // Fetch friend requests when the modal opens
    }
  }, [isOpen, fetchFriendRequests]);

  const handleRespond = (requestId, status) => {
    respondToFriendRequest(requestId, status);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop: Clicking this will close the modal */}
        <div
          className="absolute inset-0opacity-50"
          onClick={closeModal}
        ></div>

        {/* Modal Content */}
        <div className="relative rounded-lg shadow-lg w-full max-w-md p-4">
          <h2 className="text-lg font-bold mb-4">Friend Requests</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : friendRequests.length > 0 ? (
            friendRequests.map((request) => (
             
              <div key={request._id} className="flex items-center justify-between p-2 border-b">
                <img
                  src={request.sender.profilePic || "/avatar.png"}
                  alt={request.sender.fullName}
                  className="size-12 object-cover rounded-full"
                />
                <div>
                
                  <p className="font-medium">{request.sender.fullName}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-xs btn-primary"
                    onClick={() => handleRespond(request._id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-xs"
                    onClick={() => handleRespond(request._id, "declined")}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center ">No friend requests</p>
          )}
          <button
            className="btn btn-sm btn-secondary mt-4 w-full"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default FriendRequestsModal;
