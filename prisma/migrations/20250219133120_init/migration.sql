/*
  Warnings:

  - You are about to drop the `tbl_barang` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tbl_cabang` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tbl_detail_transaksi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tbl_log_barang` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tbl_stok` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tbl_transaksi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tbl_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `tbl_detail_transaksi` DROP FOREIGN KEY `tbl_detail_transaksi_barangId_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_detail_transaksi` DROP FOREIGN KEY `tbl_detail_transaksi_cabangId_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_detail_transaksi` DROP FOREIGN KEY `tbl_detail_transaksi_createdUserId_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_detail_transaksi` DROP FOREIGN KEY `tbl_detail_transaksi_transaksiId_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_log_barang` DROP FOREIGN KEY `tbl_log_barang_barangId_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_log_barang` DROP FOREIGN KEY `tbl_log_barang_cabangId_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_log_barang` DROP FOREIGN KEY `tbl_log_barang_createdUserId_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_stok` DROP FOREIGN KEY `tbl_stok_barangId_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_stok` DROP FOREIGN KEY `tbl_stok_cabangId_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_transaksi` DROP FOREIGN KEY `tbl_transaksi_userId_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_user` DROP FOREIGN KEY `tbl_user_cabangId_fkey`;

-- DropTable
DROP TABLE `tbl_barang`;

-- DropTable
DROP TABLE `tbl_cabang`;

-- DropTable
DROP TABLE `tbl_detail_transaksi`;

-- DropTable
DROP TABLE `tbl_log_barang`;

-- DropTable
DROP TABLE `tbl_stok`;

-- DropTable
DROP TABLE `tbl_transaksi`;

-- DropTable
DROP TABLE `tbl_user`;

-- CreateTable
CREATE TABLE `Cabang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `cabangId` INTEGER NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'kasir',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Barang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `harga` INTEGER NOT NULL,
    `diskon` INTEGER NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Barang_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stok` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `barangId` INTEGER NOT NULL,
    `cabangId` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `subTotal` INTEGER NULL,
    `diskon` INTEGER NULL,
    `total` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Transaksi_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetailTransaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cabangId` INTEGER NOT NULL,
    `transaksiId` INTEGER NOT NULL,
    `barangId` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `harga` INTEGER NOT NULL,
    `diskon` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdUserId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogBarang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `barangId` INTEGER NOT NULL,
    `cabangId` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `harga` INTEGER NULL,
    `total` INTEGER NULL,
    `jenis` ENUM('MASUK', 'KELUAR', 'PENJUALAN') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdUserId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_cabangId_fkey` FOREIGN KEY (`cabangId`) REFERENCES `Cabang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stok` ADD CONSTRAINT `Stok_barangId_fkey` FOREIGN KEY (`barangId`) REFERENCES `Barang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stok` ADD CONSTRAINT `Stok_cabangId_fkey` FOREIGN KEY (`cabangId`) REFERENCES `Cabang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailTransaksi` ADD CONSTRAINT `DetailTransaksi_transaksiId_fkey` FOREIGN KEY (`transaksiId`) REFERENCES `Transaksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailTransaksi` ADD CONSTRAINT `DetailTransaksi_cabangId_fkey` FOREIGN KEY (`cabangId`) REFERENCES `Cabang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailTransaksi` ADD CONSTRAINT `DetailTransaksi_barangId_fkey` FOREIGN KEY (`barangId`) REFERENCES `Barang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailTransaksi` ADD CONSTRAINT `DetailTransaksi_createdUserId_fkey` FOREIGN KEY (`createdUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogBarang` ADD CONSTRAINT `LogBarang_barangId_fkey` FOREIGN KEY (`barangId`) REFERENCES `Barang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogBarang` ADD CONSTRAINT `LogBarang_cabangId_fkey` FOREIGN KEY (`cabangId`) REFERENCES `Cabang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogBarang` ADD CONSTRAINT `LogBarang_createdUserId_fkey` FOREIGN KEY (`createdUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
