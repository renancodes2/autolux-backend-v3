/*
  Warnings:

  - You are about to drop the column `entrada` on the `Simulation` table. All the data in the column will be lost.
  - You are about to drop the column `parcelas` on the `Simulation` table. All the data in the column will be lost.
  - You are about to drop the column `resultado` on the `Simulation` table. All the data in the column will be lost.
  - You are about to drop the column `taxa` on the `Simulation` table. All the data in the column will be lost.
  - Added the required column `downPayment` to the `Simulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `financedAmount` to the `Simulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `installments` to the `Simulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interestRate` to the `Simulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `result` to the `Simulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPaid` to the `Simulation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InterestType" AS ENUM ('SIMPLE', 'COMPOUND');

-- AlterTable
ALTER TABLE "Simulation" DROP COLUMN "entrada",
DROP COLUMN "parcelas",
DROP COLUMN "resultado",
DROP COLUMN "taxa",
ADD COLUMN     "cet" DOUBLE PRECISION,
ADD COLUMN     "details" JSONB,
ADD COLUMN     "downPayment" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "financedAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "installments" INTEGER NOT NULL,
ADD COLUMN     "interestRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "interestType" "InterestType" NOT NULL DEFAULT 'COMPOUND',
ADD COLUMN     "result" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalPaid" DOUBLE PRECISION NOT NULL;
