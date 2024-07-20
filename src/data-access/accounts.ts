import { db } from "@/db";
import { UserId } from "@/use-cases/types";
import crypto from "crypto";

const ITERATIONS = 10000;

async function hashPassword(plainTextPassword: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(
      plainTextPassword,
      salt,
      ITERATIONS,
      64,
      "sha512",
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString("hex"));
      },
    );
  });
}

export async function createAccount(userId: UserId, password: string) {
  const salt = crypto.randomBytes(128).toString("base64");
  const hash = await hashPassword(password, salt);
  const account = await db
    .accounts.create({
      data: {
        userId,
        accountType: "email",
        password: hash,
        salt,
      }
    })
  return account;
}

export async function createAccountViaGithub(userId: UserId, githubId: string) {
  await db
    .accounts.create({
      data: {
        userId: userId,
        accountType: "github",
        githubId,
      }
    })
}

export async function createAccountViaGoogle(userId: UserId, googleId: string) {
  await db
    .accounts.create({
      data: {
        userId: userId,
        accountType: "google",
        googleId,
      }
    })
}

export async function getAccountByUserId(userId: UserId) {
  const account = await db.accounts.findFirst({
    where: {
      userId
    }
  });

  return account;
}

export async function updatePassword(
  userId: UserId,
  password: string,
  trx = db,
) {
  const salt = crypto.randomBytes(128).toString("base64");
  const hash = await hashPassword(password, salt);
  await trx.accounts
    .update({
      where: {
        userId,
        accountType: "email",
      },
      data: {
        password: hash,
        salt,
      }
    })
}

export async function getAccountByGoogleId(googleId: string) {
  return await db.accounts.findFirst({
    where: {
      googleId
    }
  });
}

export async function getAccountByGithubId(githubId: string) {
  return await db.accounts.findFirst({
    where: {
      githubId
    }
  });
}
