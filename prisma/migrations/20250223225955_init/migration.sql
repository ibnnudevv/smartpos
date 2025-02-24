-- CreateTable
CREATE TABLE `KasirShift` (
    `id` VARCHAR(191) NOT NULL,
    `cabangId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `mulaiShift` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tutupShift` DATETIME(3) NULL,
    `saldoAwal` INTEGER NOT NULL,
    `saldoAkhir` INTEGER NULL,
    `status` ENUM('AKTIF', 'TERTUTUP') NOT NULL DEFAULT 'AKTIF',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KasTransaksi` (
    `id` VARCHAR(191) NOT NULL,
    `kasirShiftId` VARCHAR(191) NOT NULL,
    `jenis` ENUM('KAS_MASUK', 'KAS_KELUAR', 'PENJUALAN', 'SETORAN', 'PENARIKAN') NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `keterangan` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `KasirShift` ADD CONSTRAINT `KasirShift_cabangId_fkey` FOREIGN KEY (`cabangId`) REFERENCES `Cabang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KasirShift` ADD CONSTRAINT `KasirShift_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KasTransaksi` ADD CONSTRAINT `KasTransaksi_kasirShiftId_fkey` FOREIGN KEY (`kasirShiftId`) REFERENCES `KasirShift`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
