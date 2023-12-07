/*
  Warnings:

  - The primary key for the `Formwithavatar` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Formwithavatar` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "Formwithavatar_email_key";

-- AlterTable
ALTER TABLE "Formwithavatar" DROP CONSTRAINT "Formwithavatar_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Formwithavatar_pkey" PRIMARY KEY ("id");
