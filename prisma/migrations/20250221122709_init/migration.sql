/*
  Warnings:

  - You are about to drop the column `harga` on the `LogBarang` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `LogBarang` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `LogBarang` DROP COLUMN `harga`,
    DROP COLUMN `total`;
