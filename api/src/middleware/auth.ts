import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthenticatedRequest } from "../types/auth";

export const authMiddleware = (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) => {
  const token = request.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      sub: string;
      email: string;
      name: string;
    };

    request.user = decoded;
    return next();
  } catch {
    return response.status(401).json({ message: "Invalid token" });
  }
};
