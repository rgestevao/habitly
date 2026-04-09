import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { authRoutes } from "./routes/auth-routes";
import { habitRoutes } from "./routes/habit-routes";

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL
  })
);
app.use(express.json());

app.get("/health", (_request, response) => {
  return response.json({ ok: true });
});

app.use("/auth", authRoutes);
app.use("/habits", habitRoutes);

app.use(errorHandler);
