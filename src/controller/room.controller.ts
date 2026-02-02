import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { Room } from "../models/room.model";
import { AppError } from "../utils/AppError";
import { logger } from "../config/logger";

export const createRoom = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { title, hostId, hostName } = req.body;

        if (!title || !hostId || !hostName) {
            logger.error(`Title, hostId, and hostName are required`)
            throw new AppError("Title, hostId, and hostName are required", 400);
        }

        const roomId = uuidv4();

        const room = await Room.create({
            roomId,
            title,
            hostId,
            isActive: true,
            participants: [
                {
                    userId: hostId,
                    name: hostName,
                    role: "host",
                },
            ],
        });

        res.status(201).json({
            roomId: room.roomId,
            title: room.title,
            hostId: room.hostId,
        });
    } catch (error) {
        next(error);
    }
};

export const getRoomInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { roomId } = req.params;

        const room = await Room.findOne({ roomId });

        if (!room) {
            throw new AppError("Room not found", 404);
        }

        res.status(200).json({
            roomId: room.roomId,
            title: room.title,
            isActive: room.isActive,
            participants: room.participants,
        });
    } catch (error) {
        next(error);
    }
};

export const joinRoom = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { roomId } = req.params;
        const { userId, name } = req.body;

        if (!userId || !name) {
            throw new AppError("userId and name are required", 400);
        }

        const room = await Room.findOne({ roomId });

        if (!room) {
            throw new AppError("Room not found", 404);
        }

        if (!room.isActive) {
            throw new AppError("Room is no longer active", 400);
        }

        const existingParticipant = room.participants.find(
            (p) => p.userId === userId
        );

        if (existingParticipant) {
            throw new AppError("User already in the room", 400);
        }

        room.participants.push({
            userId,
            name,
            role: "participant",
        });

        await room.save();

        res.status(200).json({
            success: true,
            participants: room.participants,
        });
    } catch (error) {
        next(error);
    }
};

export const leaveRoom = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { roomId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            throw new AppError("userId is required", 400);
        }

        const room = await Room.findOne({ roomId });

        if (!room) {
            throw new AppError("Room not found", 404);
        }

        const initialLength = room.participants.length;
        room.participants = room.participants.filter(
            (p) => p.userId !== userId
        );

        if (room.participants.length === initialLength) {
            throw new AppError("User not found in the room", 404);
        }

        if (userId === room.hostId || room.participants.length === 0) {
            room.isActive = false;
        }

        await room.save();

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        next(error);
    }
};

export const endRoom = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { roomId } = req.params;
        const { hostId } = req.body;

        if (!hostId) {
            throw new AppError("hostId is required", 400);
        }

        const room = await Room.findOne({ roomId });

        if (!room) {
            throw new AppError("Room not found", 404);
        }

        if (room.hostId !== hostId) {
            throw new AppError("Only the host can end the room", 403);
        }

        room.isActive = false;
        await room.save();

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        next(error);
    }
};
