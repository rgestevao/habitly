import { Router } from "express";
import { habitController } from "../controllers/habit-controller";
import { authMiddleware } from "../middleware/auth";

export const habitRoutes = Router();

habitRoutes.use(authMiddleware);
habitRoutes.get("/home", habitController.home);
habitRoutes.get("/calendar", habitController.calendar);
habitRoutes.post("/", habitController.create);
habitRoutes.patch("/:id", habitController.update);
habitRoutes.get("/:id", habitController.details);
habitRoutes.post("/:id/checkin", habitController.checkin);
