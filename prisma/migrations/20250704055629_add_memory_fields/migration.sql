/*
  Warnings:

  - Added the required column `date` to the `MemoryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `MemoryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `MemoryItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MemoryItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL
);
INSERT INTO "new_MemoryItem" ("id", "image", "label", "order") SELECT "id", "image", "label", "order" FROM "MemoryItem";
DROP TABLE "MemoryItem";
ALTER TABLE "new_MemoryItem" RENAME TO "MemoryItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
