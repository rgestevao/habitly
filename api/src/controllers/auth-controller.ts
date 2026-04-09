import { Request, Response } from "express";
import { z } from "zod";
import { authService } from "../services/auth-service";

const socialLoginSchema = z.object({
  provider: z.enum(["google", "github"]),
  providerUserId: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  avatarUrl: z.string().url().optional()
});

const oauthExchangeSchema = z.object({
  provider: z.enum(["google", "github"]),
  code: z.string().min(1),
  redirectUri: z.string().min(1)
});

export const authController = {
  async socialLogin(request: Request, response: Response) {
    const body = socialLoginSchema.parse(request.body);
    const result = await authService.socialLogin(body);

    return response.json(result);
  },

  async exchangeOauthCode(request: Request, response: Response) {
    const body = oauthExchangeSchema.parse(request.body);
    const result = await authService.exchangeOauthCode(body);

    return response.json(result);
  }
};
