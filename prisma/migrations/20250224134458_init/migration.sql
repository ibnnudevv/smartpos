/*
  Warnings:

  - Added the required column `judul` to the `DraftTransaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DraftTransaksi` ADD COLUMN `deskripsi` VARCHAR(191) NULL,
    ADD COLUMN `judul` VARCHAR(191) NOT NULL;
