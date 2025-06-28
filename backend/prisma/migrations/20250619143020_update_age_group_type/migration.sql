/*
  Warnings:

  - The `ageGroup` column on the `Lesson` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ageGroup` column on the `Module` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ageGroup` column on the `Theme` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "ageGroup",
ADD COLUMN     "ageGroup" INTEGER NOT NULL DEFAULT 5;

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "ageGroup",
ADD COLUMN     "ageGroup" INTEGER NOT NULL DEFAULT 5;

-- AlterTable
ALTER TABLE "Theme" DROP COLUMN "ageGroup",
ADD COLUMN     "ageGroup" INTEGER NOT NULL DEFAULT 5;
