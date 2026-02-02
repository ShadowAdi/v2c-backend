import { Document } from "mongoose";

export interface IParticipant {
    userId: string;
    name: string;
    role: "host" | "participant";
}

export interface IRoom extends Document {
    roomId: string;
    title: string;
    hostId: string;
    isActive: boolean;
    participants: IParticipant[];
    createdAt: Date;
}
