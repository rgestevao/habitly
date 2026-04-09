import { db } from "../config/db";
import { SocialProvider } from "../types/models";

type SocialLoginInput = {
  provider: SocialProvider;
  providerUserId: string;
  email: string;
  name: string;
  avatarUrl?: string;
};

export const userRepository = {
  async upsertSocialUser(input: SocialLoginInput) {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const existingByProvider = await client.query(
        `
          SELECT u.*
          FROM social_accounts sa
          INNER JOIN users u ON u.id = sa.user_id
          WHERE sa.provider = $1 AND sa.provider_user_id = $2
          LIMIT 1
        `,
        [input.provider, input.providerUserId]
      );

      if (existingByProvider.rowCount) {
        const user = existingByProvider.rows[0];

        await client.query(
          `
            UPDATE users
            SET name = $2, email = $3, avatar_url = $4, updated_at = NOW()
            WHERE id = $1
          `,
          [user.id, input.name, input.email, input.avatarUrl ?? null]
        );

        await client.query("COMMIT");
        return {
          ...user,
          name: input.name,
          email: input.email,
          avatar_url: input.avatarUrl ?? null
        };
      }

      const existingByEmail = await client.query(
        "SELECT * FROM users WHERE email = $1 LIMIT 1",
        [input.email]
      );

      const user =
        existingByEmail.rows[0] ??
        (
          await client.query(
            `
              INSERT INTO users (name, email, avatar_url)
              VALUES ($1, $2, $3)
              RETURNING *
            `,
            [input.name, input.email, input.avatarUrl ?? null]
          )
        ).rows[0];

      await client.query(
        `
          INSERT INTO social_accounts (user_id, provider, provider_user_id)
          VALUES ($1, $2, $3)
          ON CONFLICT (provider, provider_user_id) DO NOTHING
        `,
        [user.id, input.provider, input.providerUserId]
      );

      await client.query(
        `
          UPDATE users
          SET name = $2, avatar_url = $3, updated_at = NOW()
          WHERE id = $1
        `,
        [user.id, input.name, input.avatarUrl ?? null]
      );

      await client.query("COMMIT");
      return {
        ...user,
        name: input.name,
        avatar_url: input.avatarUrl ?? null
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
};
