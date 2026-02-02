import express, { Express } from "express";
import helmet from "helmet";
import { CorsConfig } from "./config/cors";
import { CustomErrorHandler } from "./middlewares/custom-error.middleware";
import roomRouter from "./routes/room.router";

const app: Express = express()

app.use(helmet())
CorsConfig(app)
app.use(express.json())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/', (_req, res) => {
    res.json({
        service: 'v2c-backend',
        status: 'running',
        version: '2.1.0',
        features: {
            rooms: 'Video room management'
        },
        endpoints: {
            health: '/api/health',
            rooms: '/api/rooms'
        }
    });
});

app.use('/api/rooms', roomRouter);

app.use(CustomErrorHandler)

export default app
