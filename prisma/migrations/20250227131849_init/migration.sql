/*
  Warnings:

  - Added the required column `metodePembayaran` to the `Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Transaksi` ADD COLUMN `metodePembayaran` ENUM('TUNAI', 'DEBIT', 'KREDIT') NOT NULL;
