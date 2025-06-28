/*
  Warnings:

  - Added the required column `ageGroup` to the `Kid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Kid" ADD COLUMN     "ageGroup" TEXT NOT NULL;
