-- CreateTable
CREATE TABLE `utilisateurs` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `motDePasse` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `role` ENUM('VENDEUR', 'ACHETEUR', 'ADMIN') NOT NULL DEFAULT 'VENDEUR',
    `estVip` BOOLEAN NOT NULL DEFAULT false,
    `vipExpireLe` DATETIME(3) NULL,
    `creeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `misAJourLe` DATETIME(3) NOT NULL,

    UNIQUE INDEX `utilisateurs_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articles` (
    `id` VARCHAR(191) NOT NULL,
    `vendeurId` VARCHAR(191) NOT NULL,
    `vendeurTelephone` VARCHAR(191) NOT NULL,
    `titre` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `prix` DOUBLE NOT NULL,
    `categorie` VARCHAR(191) NULL,
    `urlImage` VARCHAR(191) NOT NULL,
    `photoPriseAvecApp` BOOLEAN NOT NULL DEFAULT true,
    `statut` ENUM('ACTIF', 'VENDU', 'EXPIRE', 'SUPPRIME') NOT NULL DEFAULT 'ACTIF',
    `publieLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expireLe` DATETIME(3) NOT NULL,
    `supprimeLe` DATETIME(3) NULL,
    `nombreVues` INTEGER NOT NULL DEFAULT 0,
    `nombreInteractions` INTEGER NOT NULL DEFAULT 0,

    INDEX `articles_titre_idx`(`titre`),
    INDEX `articles_categorie_idx`(`categorie`),
    INDEX `articles_statut_idx`(`statut`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vues_articles` (
    `id` VARCHAR(191) NOT NULL,
    `articleId` VARCHAR(191) NOT NULL,
    `utilisateurId` VARCHAR(191) NULL,
    `ip` VARCHAR(191) NULL,
    `creeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `vues_articles_articleId_idx`(`articleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favoris` (
    `id` VARCHAR(191) NOT NULL,
    `utilisateurId` VARCHAR(191) NOT NULL,
    `articleId` VARCHAR(191) NOT NULL,
    `creeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `favoris_utilisateurId_articleId_key`(`utilisateurId`, `articleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `signalements` (
    `id` VARCHAR(191) NOT NULL,
    `articleId` VARCHAR(191) NOT NULL,
    `auteurId` VARCHAR(191) NULL,
    `raison` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `creeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `statistiques_admin` (
    `id` VARCHAR(191) NOT NULL,
    `totalArticles` INTEGER NOT NULL,
    `totalUtilisateurs` INTEGER NOT NULL,
    `totalVues` INTEGER NOT NULL,
    `misAJourLe` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_vendeurId_fkey` FOREIGN KEY (`vendeurId`) REFERENCES `utilisateurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vues_articles` ADD CONSTRAINT `vues_articles_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `articles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vues_articles` ADD CONSTRAINT `vues_articles_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `utilisateurs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favoris` ADD CONSTRAINT `favoris_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `utilisateurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favoris` ADD CONSTRAINT `favoris_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `articles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `signalements` ADD CONSTRAINT `signalements_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `articles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `signalements` ADD CONSTRAINT `signalements_auteurId_fkey` FOREIGN KEY (`auteurId`) REFERENCES `utilisateurs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
