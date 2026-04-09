import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { userRepository } from "../repositories/user-repository";
import { SocialProvider } from "../types/models";
import { AppError } from "../utils/errors";

type LoginInput = {
  provider: SocialProvider;
  providerUserId: string;
  email: string;
  name: string;
  avatarUrl?: string;
};

type OauthExchangeInput = {
  provider: SocialProvider;
  code: string;
  redirectUri: string;
};

type OAuthProfile = LoginInput;

type GitHubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
};

const formHeaders = {
  "Content-Type": "application/x-www-form-urlencoded",
  Accept: "application/json"
};

const requireProviderConfig = (provider: SocialProvider) => {
  if (provider === "google") {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
      throw new AppError("Google OAuth is not configured on the API", 500);
    }

    return {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    };
  }

  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    throw new AppError("GitHub OAuth is not configured on the API", 500);
  }

  return {
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET
  };
};

const issueSession = (user: { id: string; name: string; email: string; avatar_url?: string | null }) => {
  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name
    },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatar_url ?? null
    }
  };
};

const getGoogleProfile = async (code: string, redirectUri: string): Promise<OAuthProfile> => {
  const config = requireProviderConfig("google");
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: formHeaders,
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code"
    })
  });

  const tokenPayload = await tokenResponse.json();

  if (!tokenResponse.ok || !tokenPayload.access_token) {
    throw new AppError(tokenPayload.error_description ?? "Google OAuth exchange failed", 400);
  }

  const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${tokenPayload.access_token}`
    }
  });

  const profile = await profileResponse.json();

  if (!profileResponse.ok || !profile.sub || !profile.email) {
    throw new AppError("Unable to load Google profile", 400);
  }

  return {
    provider: "google",
    providerUserId: profile.sub,
    email: profile.email,
    name: profile.name ?? profile.email.split("@")[0],
    avatarUrl: profile.picture
  };
};

const getGithubProfile = async (code: string, redirectUri: string): Promise<OAuthProfile> => {
  const config = requireProviderConfig("github");
  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: formHeaders,
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: redirectUri
    })
  });

  const tokenPayload = await tokenResponse.json();

  if (!tokenResponse.ok || !tokenPayload.access_token) {
    throw new AppError(tokenPayload.error_description ?? "GitHub OAuth exchange failed", 400);
  }

  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${tokenPayload.access_token}`,
    "X-GitHub-Api-Version": "2022-11-28"
  };

  const [profileResponse, emailsResponse] = await Promise.all([
    fetch("https://api.github.com/user", { headers }),
    fetch("https://api.github.com/user/emails", { headers })
  ]);

  const profile = await profileResponse.json();
  const emails = (await emailsResponse.json()) as GitHubEmail[];

  if (!profileResponse.ok || !profile.id) {
    throw new AppError("Unable to load GitHub profile", 400);
  }

  const primaryEmail = emails.find((entry) => entry.primary && entry.verified)?.email
    ?? emails.find((entry) => entry.verified)?.email
    ?? profile.email;

  if (!primaryEmail) {
    throw new AppError("GitHub account does not expose a verified email", 400);
  }

  return {
    provider: "github",
    providerUserId: String(profile.id),
    email: primaryEmail,
    name: profile.name ?? profile.login,
    avatarUrl: profile.avatar_url
  };
};

export const authService = {
  async socialLogin(input: LoginInput) {
    const user = await userRepository.upsertSocialUser(input);
    return issueSession(user);
  },

  async exchangeOauthCode(input: OauthExchangeInput) {
    const profile = input.provider === "google"
      ? await getGoogleProfile(input.code, input.redirectUri)
      : await getGithubProfile(input.code, input.redirectUri);

    return this.socialLogin(profile);
  }
};
