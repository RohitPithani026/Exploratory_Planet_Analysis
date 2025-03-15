/*
  Warnings:

  - You are about to drop the column `Bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Location` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SpecialFields" AS ENUM ('ASTRONOMER', 'DATA_SCIENTIST', 'ASTROPHYSICS', 'PLANETARY_SCIENCE', 'MACHINE_LEARNING_ENGINEER', 'QUANTUM_PHYSICIST', 'SOFTWARE_ENGINEER', 'AI_RESEARCHER', 'SPACE_SCIENTIST', 'COSMOLOGIST', 'GEOPHYSICIST', 'CYBERSECURITY_ANALYST', 'ENVIRONMENTAL_SCIENTIST', 'AEROSPACE_ENGINEER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "Bio",
DROP COLUMN "Location",
DROP COLUMN "Role",
DROP COLUMN "name",
DROP COLUMN "password",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "researchFocus" TEXT,
ADD COLUMN     "role" TEXT;

-- CreateTable
CREATE TABLE "SpecializedFields" (
    "id" TEXT NOT NULL,
    "fields" "SpecialFields" NOT NULL,
    "added" BOOLEAN,
    "specializedId" TEXT NOT NULL,

    CONSTRAINT "SpecializedFields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discovery" (
    "id" TEXT NOT NULL,
    "planetName" TEXT NOT NULL,
    "planetRadius" DOUBLE PRECISION,
    "planetMass" DOUBLE PRECISION,
    "orbitalPeriod" DOUBLE PRECISION,
    "equilibriumTemperature" DOUBLE PRECISION,
    "starTemperature" DOUBLE PRECISION,
    "starMass" DOUBLE PRECISION,
    "starRadius" DOUBLE PRECISION,
    "starMetallicity" DOUBLE PRECISION,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Discovery_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SpecializedFields" ADD CONSTRAINT "SpecializedFields_specializedId_fkey" FOREIGN KEY ("specializedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discovery" ADD CONSTRAINT "Discovery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
