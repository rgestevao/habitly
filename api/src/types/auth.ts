import { Request } from "express";

export type JwtPayload = {
  sub: string;
  email: string;
  name: string;
};

export type AuthenticatedRequest = Request & {
  user?: JwtPayload;
};
