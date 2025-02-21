/*
  Warnings:

  - Added the required column `kategoriBarangId` to the `Barang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Barang` ADD COLUMN `kategoriBarangId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `KategoriBarang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Barang` ADD CONSTRAINT `Barang_kategoriBarangId_fkey` FOREIGN KEY (`kategoriBarangId`) REFERENCES `KategoriBarang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
