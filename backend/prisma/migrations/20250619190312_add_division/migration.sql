/*
  Warnings:

  - You are about to drop the column `divisionName` on the `Kid` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Kid" DROP CONSTRAINT "Kid_divisionName_fkey";

-- AlterTable
ALTER TABLE "Kid" DROP COLUMN "divisionName",
ADD COLUMN     "divisionDivisionId" INTEGER;

-- AddForeignKey
ALTER TABLE "Kid" ADD CONSTRAINT "Kid_divisionDivisionId_fkey" FOREIGN KEY ("divisionDivisionId") REFERENCES "Division"("divisionId") ON DELETE SET NULL ON UPDATE CASCADE;
