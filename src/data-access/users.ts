import { db } from "@/db";
import { User } from "@/db/schema";
import crypto from "crypto";
import { UserId } from "@/use-cases/types";
import { getAccountByUserId } from "@/data-access/accounts";


const ITERATIONS = 10000;
const MAGIC_LINK_TOKEN_TTL = 1000 * 60 * 5; // 5 min

export async function deleteUser(userId: UserId) {
  await db.users.delete({
    where: { id: userId },
  })
}

export async function getUser(userId: UserId) {
  const user = await db.users.findFirst({
    where: {
      id: userId,
    }
  })

  return user;
}

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

export async function createUser(email: string) {
  const user = await db
    .users.create({
      data: {
        email
      }
    })
  return user;
}

export async function createMagicUser(email: string) {
  const user = await db
    .users.create({
      data: {
        email,
        emailVerified: new Date(),
      }
    })

  await db
    .accounts.create({
      data: {
        userId: user.id,
        accountType: "email",
      }
    })

  return user;
}

export async function verifyPassword(email: string, plainTextPassword: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    return false;
  }

  const account = await getAccountByUserId(user.id);

  if (!account) {
    return false;
  }

  const salt = account.salt;
  const savedPassword = account.password;

  if (!salt || !savedPassword) {
    return false;
  }

  const hash = await hashPassword(plainTextPassword, salt);
  return account.password == hash;
}

export async function getUserByEmail(email: string) {
  const user = await db.users.findFirst({
    where: {
      email
    }
  });

  return user;
}

export async function getMagicUserAccountByEmail(email: string) {
  const user = await getUserByEmail(email);

  return user;
}

export async function setEmailVerified(userId: UserId) {
  await db
    .users.update({
      where: {
        id: userId
      },
      data: {
        emailVerified: new Date()
      }
    })
}

export async function updateUser(userId: UserId, updatedUser: Partial<User>) {
  await db.users.update({
    where: {
      id: userId
    },
    data: {
      ...updateUser
    }
  })
}
