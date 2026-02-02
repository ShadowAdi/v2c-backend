import { createServer } from "http";
import app from "./server";
import { initializeConnection } from "./db/initialize.connection";
import { PORT } from "./config/dotenv";
import { logger } from "./config/logger";
import { shutdown } from "./utils/graceful-shutdown";

const server = createServer(app)


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