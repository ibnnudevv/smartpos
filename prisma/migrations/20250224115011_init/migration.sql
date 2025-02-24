-- CreateTable
CREATE TABLE `DraftTransaksi` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `cabangId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetailDraftTransaksi` (
    `id` VARCHAR(191) NOT NULL,
    `draftTransaksiId` VARCHAR(191) NOT NULL,
    `barangId` VARCHAR(191) NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `harga` INTEGER NOT NULL,
    `diskon` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DraftTransaksi` ADD CONSTRAINT `DraftTransaksi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DraftTransaksi` ADD CONSTRAINT `DraftTransaksi_cabangId_fkey` FOREIGN KEY (`cabangId`) REFERENCES `Cabang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailDraftTransaksi` ADD CONSTRAINT `DetailDraftTransaksi_draftTransaksiId_fkey` FOREIGN KEY (`draftTransaksiId`) REFERENCES `DraftTransaksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailDraftTransaksi` ADD CONSTRAINT `DetailDraftTransaksi_barangId_fkey` FOREIGN KEY (`barangId`) REFERENCES `Barang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
