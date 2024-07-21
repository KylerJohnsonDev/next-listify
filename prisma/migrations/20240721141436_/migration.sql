-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_list" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "creatorId" INTEGER NOT NULL,
    CONSTRAINT "list_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_list" ("creatorId", "description", "id", "name") SELECT "creatorId", coalesce("description", '') AS "description", "id", "name" FROM "list";
DROP TABLE "list";
ALTER TABLE "new_list" RENAME TO "list";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
