import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage, getFriendUsers } from "../controllers/message.controller.js";

const router = express.Router();

router.get('/users', protectRoute, getUsersForSidebar);
router.get('/friendusers', protectRoute, getFriendUsers); // Fixed endpoint
router.get('/:id', protectRoute, getMessages);
router.post('/send/:id', protectRoute, sendMessage);

export default router;
