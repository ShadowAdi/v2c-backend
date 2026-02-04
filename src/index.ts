import { createServer } from "http";
import app from "./server";
import { initializeConnection } from "./db/initialize.connection";
import { PEER_PORT, PORT } from "./config/dotenv";
import { logger } from "./config/logger";
import { shutdown } from "./utils/graceful-shutdown";
import { Server } from "socket.io";
import { PeerServer } from "peer";

const server = createServer(app)

const peerServer = PeerServer({
    port: Number(PEER_PORT),
    path: '/peerjs',
    allow_discovery: true
});

peerServer.on('connection', (client) => {
    console.log('✓ PeerJS client connected:', client.getId());
});

peerServer.on('disconnect', (client) => {
    console.log('✗ PeerJS client disconnected:', client.getId());
});


const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
})


io.on("connection", (s) => {
    console.log(`A User connected: ${s.id}`)

    s.on("chat-message", (msg) => {
        console.log(`message value `, msg)
        io.emit("get-messages", msg)
    })

    s.on("join-room", ({ userId,
        meetId }) => {
        console.log("Join room meet id ", meetId, " user id ", userId)
        s.join(meetId)
        s.to(meetId).emit("user-joined", { userId })
    })

    s.on("disconnect", () => {
        console.log(`Someone disconnected`)
    })
})

const startServer = async () => {
    await initializeConnection()

    server.listen(PORT, () => {
        console.log(`Server running at PORT: ${PORT}`)
        logger.info(`Server running at PORT: ${PORT}`)
    })
}

startServer()

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    logger.error(`Uncaught Exception: ${err}`)
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    logger.error(`Uncaught Rejection: ${reason}`)
    process.exit(1);
});