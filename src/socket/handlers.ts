import { Server, Socket } from "socket.io";

export function registerSocketHandlers(io: Server, socket: Socket) {
    socket.on("join-room", ({ roomId, userId, peerId, name }: { roomId: string, userId: string, peerId: string, name: string }) => {
        socket.join(roomId);
        socket.to(roomId).emit("user-joined", {
            userId,
            peerId,
            name
        })
    })

    socket.on("leave-room", ({ roomId, userId }: { roomId: string, userId: string }) => {
        socket.leave(roomId);
        socket.to(roomId).emit("user-left", {
            userId,
        })
    })

    socket.on("draw", ({ roomId, stroke }) => {
        socket.to(roomId).emit("draw", stroke);
    });

    socket.on("clear-board", ({ roomId }) => {
        socket.to(roomId).emit("clear-board");
    });

    socket.on("disconnect", () => {
        console.log("❌ Socket disconnected:", socket.id);
    });
}