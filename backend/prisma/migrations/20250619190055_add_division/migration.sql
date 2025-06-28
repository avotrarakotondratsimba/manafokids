-- AlterTable
ALTER TABLE "Kid" ADD COLUMN     "divisionName" TEXT NOT NULL DEFAULT 'bronze',
ADD COLUMN     "totalXp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "weekXp" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Division" (
    "divisionId" SERIAL NOT NULL,
    "divisionName" TEXT NOT NULL,
    "divisionUrl" TEXT,

    CONSTRAINT "Division_pkey" PRIMARY KEY ("divisionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Division_divisionName_key" ON "Division"("divisionName");

-- AddForeignKey
ALTER TABLE "Kid" ADD CONSTRAINT "Kid_divisionName_fkey" FOREIGN KEY ("divisionName") REFERENCES "Division"("divisionName") ON DELETE RESTRICT ON UPDATE CASCADE;
