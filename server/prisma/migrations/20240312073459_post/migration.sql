-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PostItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PostItem_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PostItem" ("content", "createdAt", "id", "postId", "type", "updatedAt") SELECT "content", "createdAt", "id", "postId", "type", "updatedAt" FROM "PostItem";
DROP TABLE "PostItem";
ALTER TABLE "new_PostItem" RENAME TO "PostItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
