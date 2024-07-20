import { generateRandomToken } from "@/data-access/utils";
import { db } from "@/db";
import { verifyEmailTokens } from "@/db/schema";
import { UserId } from "@/use-cases/types";
import { eq } from "drizzle-orm";
import { TOKEN_LENGTH, TOKEN_TTL } from "./magic-links";

export async function createVerifyEmailToken(userId: UserId) {
  const token = await generateRandomToken(TOKEN_LENGTH);
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL);

  await db.verifyEmailTokens.upsert({
    create: {
      userId,
      token,
      tokenExpiresAt,
    },
    update: {
      token,
      tokenExpiresAt,
    },
    where: {
      userId,
    },
  })

  return token;
}

export async function getVerifyEmailToken(token: string) {
  const existingToken = await db.verifyEmailTokens.findFirst({
    where: { token }
  });

  return existingToken;
}

export async function deleteVerifyEmailToken(token: string) {
  await db.verifyEmailTokens.delete({
    where: { token }
  })
}
