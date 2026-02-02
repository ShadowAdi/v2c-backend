import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { registerSocketHandlers } from "./handlers";

export function initSocket(server: Server) {
    const io = new SocketIOServer(server, {
        path: "/socket.io/meet/",
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        },
        transports: ["websocket", "polling"],
        pingTimeout: 60000,
        pingInterval: 25000
    })

    io.on("connection", (socket) => {
        console.log("🔌 Chat Socket connected:", socket.id);

        socket.onAny((event, ...args) => {
            console.log(" Chat Event received:", event);
        });


        try {
            registerSocketHandlers(io, socket);
        } catch (error) {
            console.error("Error registering socket handlers:", error);
            socket.emit("error", { message: "Failed to initialize socket handlers" });
        }

        socket.on("disconnect", (reason) => {
            console.log("❌ Chat Socket disconnected:", socket.id, "Reason:", reason);
        });

        socket.on("error", (error) => {
            console.error("❌ Chat Socket error:", socket.id, error);
        });
    })
    return io
}