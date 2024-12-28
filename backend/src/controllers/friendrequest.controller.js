import FriendRequest from "../models/friendrequest.model.js";
import User from "../models/user.model.js";

// Send Friend Request
export const sendFriendRequest = async (req, res) => {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    try {
        // Check if receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }

        // Check if a request already exists
        const existingRequest = await FriendRequest.findOne({ sender: senderId, receiver: receiverId });
        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        // Create a new friend request
        const newRequest = new FriendRequest({ sender: senderId, receiver: receiverId });
        await newRequest.save();

        res.status(201).json({ message: "Friend request sent successfully" });
    } catch (error) {
        console.error("Error in sendFriendRequest:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Respond to Friend Request
export const respondToFriendRequest = async (req, res) => {
    const { requestId, status } = req.body;
    const userId = req.user._id;

    try {
        // Validate status
        if (!["accepted", "declined"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Find the friend request
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        // Check if the current user is the receiver
        if (friendRequest.receiver.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to respond to this request" });
        }

        // If accepted, update the friends array for both users
        if (status === "accepted") {
            await User.findByIdAndUpdate(userId, {
                $addToSet: { friends: friendRequest.sender }, // Add sender to receiver's friends list
            });

            await User.findByIdAndUpdate(friendRequest.sender, {
                $addToSet: { friends: friendRequest.receiver }, // Add receiver to sender's friends list
            });
        }

        // If declined, delete the friend request entry
        if (status === "declined") {
            await FriendRequest.findByIdAndDelete(requestId); // Delete the declined request
        }

        // Update the friend request status if accepted
        if (status === "accepted") {
            await FriendRequest.findByIdAndDelete(requestId);
        }

        res.status(200).json({ message: `Friend request ${status} successfully` });
    } catch (error) {
        console.error("Error in respondToFriendRequest:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get Friend Requests
export const getFriendRequests = async (req, res) => {
    const userId = req.user._id;

    try {
        // Fetch all pending friend requests for the user
        const friendRequests = await FriendRequest.find({ receiver: userId, status: "pending" })
            .populate("sender", "fullName email profilePic"); // Populate sender details

        res.status(200).json(friendRequests);
    } catch (error) {
        console.error("Error in getFriendRequests:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
