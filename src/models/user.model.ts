import mongoose, { Model, Schema, Types } from "mongoose";
import { IUser } from "../interfaces/user.interface";


const schema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    peerId: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["host", "participant"]
    },
}, {
    timestamps: true
})


export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", schema);