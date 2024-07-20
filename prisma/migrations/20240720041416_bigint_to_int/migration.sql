/*
  Warnings:

  - The primary key for the `accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `userId` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `magic_links` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `magic_links` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `userId` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `reset_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `reset_tokens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `userId` on the `reset_tokens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `userId` on the `session` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `verify_email_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `verify_email_tokens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `userId` on the `verify_email_tokens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_accounts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "accountType" TEXT NOT NULL,
    "githubId" TEXT,
    "googleId" TEXT,
    "password" TEXT,
    "salt" TEXT,
    CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_accounts" ("accountType", "githubId", "googleId", "id", "password", "salt", "userId") SELECT "accountType", "githubId", "googleId", "id", "password", "salt", "userId" FROM "accounts";
DROP TABLE "accounts";
ALTER TABLE "new_accounts" RENAME TO "accounts";
CREATE UNIQUE INDEX "accounts_userId_key" ON "accounts"("userId");
CREATE UNIQUE INDEX "accounts_githubId_key" ON "accounts"("githubId");
CREATE UNIQUE INDEX "accounts_googleId_key" ON "accounts"("googleId");
CREATE TABLE "new_magic_links" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "tokenExpiresAt" DATETIME NOT NULL
);
INSERT INTO "new_magic_links" ("email", "id", "token", "tokenExpiresAt") SELECT "email", "id", "token", "tokenExpiresAt" FROM "magic_links";
DROP TABLE "magic_links";
ALTER TABLE "new_magic_links" RENAME TO "magic_links";
CREATE UNIQUE INDEX "magic_links_email_key" ON "magic_links"("email");
CREATE UNIQUE INDEX "magic_links_token_key" ON "magic_links"("token");
CREATE TABLE "new_profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "displayName" TEXT,
    "imageId" TEXT,
    "image" TEXT,
    "bio" TEXT,
    CONSTRAINT "profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_profile" ("bio", "displayName", "id", "image", "imageId", "userId") SELECT "bio", "displayName", "id", "image", "imageId", "userId" FROM "profile";
DROP TABLE "profile";
ALTER TABLE "new_profile" RENAME TO "profile";
CREATE UNIQUE INDEX "profile_userId_key" ON "profile"("userId");
CREATE TABLE "new_reset_tokens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "tokenExpiresAt" DATETIME NOT NULL,
    CONSTRAINT "reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_reset_tokens" ("id", "token", "tokenExpiresAt", "userId") SELECT "id", "token", "tokenExpiresAt", "userId" FROM "reset_tokens";
DROP TABLE "reset_tokens";
ALTER TABLE "new_reset_tokens" RENAME TO "reset_tokens";
CREATE UNIQUE INDEX "reset_tokens_userId_key" ON "reset_tokens"("userId");
CREATE UNIQUE INDEX "reset_tokens_token_key" ON "reset_tokens"("token");
CREATE TABLE "new_session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_session" ("expiresAt", "id", "userId") SELECT "expiresAt", "id", "userId" FROM "session";
DROP TABLE "session";
ALTER TABLE "new_session" RENAME TO "session";
CREATE UNIQUE INDEX "session_userId_key" ON "session"("userId");
CREATE TABLE "new_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME
);
INSERT INTO "new_user" ("email", "emailVerified", "id") SELECT "email", "emailVerified", "id" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
CREATE TABLE "new_verify_email_tokens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "tokenExpiresAt" DATETIME NOT NULL,
    CONSTRAINT "verify_email_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_verify_email_tokens" ("id", "token", "tokenExpiresAt", "userId") SELECT "id", "token", "tokenExpiresAt", "userId" FROM "verify_email_tokens";
DROP TABLE "verify_email_tokens";
ALTER TABLE "new_verify_email_tokens" RENAME TO "verify_email_tokens";
CREATE UNIQUE INDEX "verify_email_tokens_userId_key" ON "verify_email_tokens"("userId");
CREATE UNIQUE INDEX "verify_email_tokens_token_key" ON "verify_email_tokens"("token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
