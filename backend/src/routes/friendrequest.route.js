import express from "express";
import { sendFriendRequest, respondToFriendRequest, getFriendRequests } from "../controllers/friendrequest.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js"; // Assuming you have an authentication middleware


const router = express.Router();

// Send a friend request
router.post("/send", protectRoute, sendFriendRequest);

// Respond to a friend request (accept/decline)
router.post("/respond", protectRoute, respondToFriendRequest);

// Get all friend requests for the logged-in user
router.get("/", protectRoute, getFriendRequests);



export default router;
