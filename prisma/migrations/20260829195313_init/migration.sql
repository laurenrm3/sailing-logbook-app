/*
  Warnings:

  - You are about to drop the column `boatName` on the `Trip` table. All the data in the column will be lost.
  - Added the required column `boatLabel` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "boatLabel" TEXT NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "distanceNm" REAL,
    "conditions" TEXT,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Trip" ("conditions", "date", "distanceNm", "durationMin", "id", "notes", "userId") SELECT "conditions", "date", "distanceNm", "durationMin", "id", "notes", "userId" FROM "Trip";
DROP TABLE "Trip";
ALTER TABLE "new_Trip" RENAME TO "Trip";
CREATE INDEX "Trip_userId_idx" ON "Trip"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
