/*
  Warnings:

  - The values [Afique] on the enum `State` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "State_new" AS ENUM ('France', 'Italie', 'Espagne', 'Japon', 'Inde', 'Chine', 'Thai', 'Asie', 'AmeriqueLatine', 'Afrique', 'Magreb', 'Autre');
ALTER TABLE "Recipe" ALTER COLUMN "country" TYPE "State_new" USING ("country"::text::"State_new");
ALTER TYPE "State" RENAME TO "State_old";
ALTER TYPE "State_new" RENAME TO "State";
DROP TYPE "public"."State_old";
COMMIT;
