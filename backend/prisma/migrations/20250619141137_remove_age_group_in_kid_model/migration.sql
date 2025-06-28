/*
  Warnings:

  - You are about to drop the column `ageGroup` on the `Kid` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Kid" DROP COLUMN "ageGroup";

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "ageGroup" TEXT NOT NULL DEFAULT '-5';

-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "ageGroup" TEXT NOT NULL DEFAULT '-5';

-- AlterTable
ALTER TABLE "Theme" ADD COLUMN     "ageGroup" TEXT NOT NULL DEFAULT '-5';
