import { Router } from "express";
import {
    createRoom,
    getRoomInfo,
    joinRoom,
    leaveRoom,
    endRoom,
} from "../controller/room.controller";

const router = Router();

// Create a new room
router.post("/", createRoom);

// Get room information
router.get("/:roomId", getRoomInfo);

// Join a room
router.post("/:roomId/join", joinRoom);

// Leave a room
router.post("/:roomId/leave", leaveRoom);

// End a room (host only)
router.post("/:roomId/end", endRoom);

export default router;
