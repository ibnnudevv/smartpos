/*
  Warnings:

  - The primary key for the `Barang` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Cabang` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `DetailTransaksi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `KategoriBarang` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LogBarang` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Stok` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Transaksi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Barang` DROP FOREIGN KEY `Barang_kategoriBarangId_fkey`;

-- DropForeignKey
ALTER TABLE `DetailTransaksi` DROP FOREIGN KEY `DetailTransaksi_barangId_fkey`;

-- DropForeignKey
ALTER TABLE `DetailTransaksi` DROP FOREIGN KEY `DetailTransaksi_cabangId_fkey`;

-- DropForeignKey
ALTER TABLE `DetailTransaksi` DROP FOREIGN KEY `DetailTransaksi_createdUserId_fkey`;

-- DropForeignKey
ALTER TABLE `DetailTransaksi` DROP FOREIGN KEY `DetailTransaksi_transaksiId_fkey`;

-- DropForeignKey
ALTER TABLE `LogBarang` DROP FOREIGN KEY `LogBarang_barangId_fkey`;

-- DropForeignKey
ALTER TABLE `LogBarang` DROP FOREIGN KEY `LogBarang_cabangId_fkey`;

-- DropForeignKey
ALTER TABLE `LogBarang` DROP FOREIGN KEY `LogBarang_createdUserId_fkey`;

-- DropForeignKey
ALTER TABLE `Stok` DROP FOREIGN KEY `Stok_barangId_fkey`;

-- DropForeignKey
ALTER TABLE `Stok` DROP FOREIGN KEY `Stok_cabangId_fkey`;

-- DropForeignKey
ALTER TABLE `Transaksi` DROP FOREIGN KEY `Transaksi_userId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_cabangId_fkey`;

-- DropIndex
DROP INDEX `Barang_kategoriBarangId_fkey` ON `Barang`;

-- DropIndex
DROP INDEX `DetailTransaksi_barangId_fkey` ON `DetailTransaksi`;

-- DropIndex
DROP INDEX `DetailTransaksi_cabangId_fkey` ON `DetailTransaksi`;

-- DropIndex
DROP INDEX `DetailTransaksi_createdUserId_fkey` ON `DetailTransaksi`;

-- DropIndex
DROP INDEX `DetailTransaksi_transaksiId_fkey` ON `DetailTransaksi`;

-- DropIndex
DROP INDEX `LogBarang_barangId_fkey` ON `LogBarang`;

-- DropIndex
DROP INDEX `LogBarang_cabangId_fkey` ON `LogBarang`;

-- DropIndex
DROP INDEX `LogBarang_createdUserId_fkey` ON `LogBarang`;

-- DropIndex
DROP INDEX `Stok_barangId_fkey` ON `Stok`;

-- DropIndex
DROP INDEX `Stok_cabangId_fkey` ON `Stok`;

-- DropIndex
DROP INDEX `Transaksi_userId_fkey` ON `Transaksi`;

-- DropIndex
DROP INDEX `User_cabangId_fkey` ON `User`;

-- AlterTable
ALTER TABLE `Barang` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `kategoriBarangId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Cabang` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `DetailTransaksi` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `cabangId` VARCHAR(191) NOT NULL,
    MODIFY `transaksiId` VARCHAR(191) NOT NULL,
    MODIFY `barangId` VARCHAR(191) NOT NULL,
    MODIFY `createdUserId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `KategoriBarang` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `LogBarang` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `barangId` VARCHAR(191) NOT NULL,
    MODIFY `cabangId` VARCHAR(191) NOT NULL,
    MODIFY `createdUserId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Stok` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `barangId` VARCHAR(191) NOT NULL,
    MODIFY `cabangId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Transaksi` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `cabangId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_cabangId_fkey` FOREIGN KEY (`cabangId`) REFERENCES `Cabang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Barang` ADD CONSTRAINT `Barang_kategoriBarangId_fkey` FOREIGN KEY (`kategoriBarangId`) REFERENCES `KategoriBarang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE `LogBarang` ADD CONSTRAINT `LogBarang_createdUserId_fkey` FOREIGN KEY (`createdUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
