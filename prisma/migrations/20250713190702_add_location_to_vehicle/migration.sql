/*
  Warnings:

  - Added the required column `city` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transmission` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Transmission" AS ENUM ('MANUAL', 'AUTOMATIC', 'CVT');

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "engine" TEXT,
ADD COLUMN     "licensePlate" TEXT,
ADD COLUMN     "model" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "transmission" "Transmission" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
