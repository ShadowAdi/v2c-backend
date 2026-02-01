import { Router } from "express";
import { HealthController } from "../controller/health.controller";

export const healthRouter: Router = Router()

healthRouter.get("/", HealthController)