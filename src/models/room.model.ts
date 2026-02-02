import mongoose, { Model, Schema } from "mongoose";
import { IRoom, IParticipant } from "../interfaces/room.interface";

const participantSchema = new Schema<IParticipant>(
    {
        userId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["host", "participant"],
            required: true,
        },
    },
    { _id: false }
);

const roomSchema = new Schema<IRoom>(
    {
        roomId: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
        },
        hostId: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        participants: {
            type: [participantSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export const Room: Model<IRoom> =
    mongoose.models.Room || mongoose.model<IRoom>("Room", roomSchema);
