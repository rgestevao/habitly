import { Router } from "express";
import { authController } from "../controllers/auth-controller";

export const authRoutes = Router();

authRoutes.post("/social", authController.socialLogin);
authRoutes.post("/oauth/exchange", authController.exchangeOauthCode);
