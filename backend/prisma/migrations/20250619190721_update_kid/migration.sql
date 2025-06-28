/*
  Warnings:

  - You are about to drop the column `divisionDivisionId` on the `Kid` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Kid" DROP CONSTRAINT "Kid_divisionDivisionId_fkey";

-- AlterTable
ALTER TABLE "Kid" DROP COLUMN "divisionDivisionId",
ADD COLUMN     "divisionName" TEXT NOT NULL DEFAULT 'bronze';

-- AddForeignKey
ALTER TABLE "Kid" ADD CONSTRAINT "Kid_divisionName_fkey" FOREIGN KEY ("divisionName") REFERENCES "Division"("divisionName") ON DELETE RESTRICT ON UPDATE CASCADE;
