-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_accounts" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "userId" BIGINT NOT NULL,
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
