import { generateRandomToken } from "@/data-access/utils";
import { UserId } from "@/use-cases/types";
import { TOKEN_LENGTH, TOKEN_TTL } from "./magic-links";
import { db } from "@/db";

export async function createPasswordResetToken(userId: UserId) {
  const token = await generateRandomToken(TOKEN_LENGTH);
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL);

  await db.resetTokens.delete({ 
    where: { userId }
  });
  await db.resetTokens.create({
    data: {
      userId,
      token,
      tokenExpiresAt,
    }
  })

  return token;
}

export async function getPasswordResetToken(token: string) {
  const existingToken = await db.resetTokens.findFirst({
    where: { token}
  })

  return existingToken;
}

export async function deletePasswordResetToken(token: string, trx = db) {
  await trx.resetTokens.delete({
    where: { token }
  })
}
