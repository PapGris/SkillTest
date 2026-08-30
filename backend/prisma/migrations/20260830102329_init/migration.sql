-- CreateTable
CREATE TABLE `role` (
    `id_role` INTEGER NOT NULL AUTO_INCREMENT,
    `nom_role` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id_role`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `utilisateur` (
    `id_utilisateur` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `prenom` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `mot_de_passe` VARCHAR(255) NOT NULL,
    `id_role` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `utilisateur_email_key`(`email`),
    PRIMARY KEY (`id_utilisateur`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parcours` (
    `id_parcours` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(150) NOT NULL,
    `description` TEXT NULL,
    `id_createur` INTEGER NOT NULL,

    PRIMARY KEY (`id_parcours`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evaluation` (
    `id_evaluation` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(150) NOT NULL,
    `type_evaluation` VARCHAR(50) NOT NULL,
    `id_parcours` INTEGER NOT NULL,

    PRIMARY KEY (`id_evaluation`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `competence` (
    `id_competence` INTEGER NOT NULL AUTO_INCREMENT,
    `nom_competence` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id_competence`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `competence_utilisateur` (
    `id_utilisateur` INTEGER NOT NULL,
    `id_competence` INTEGER NOT NULL,
    `niveau_estime` INTEGER NOT NULL,

    PRIMARY KEY (`id_utilisateur`, `id_competence`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `question` (
    `id_question` INTEGER NOT NULL AUTO_INCREMENT,
    `enonce` TEXT NOT NULL,
    `points` INTEGER NOT NULL,
    `id_evaluation` INTEGER NOT NULL,
    `id_competence` INTEGER NULL,

    PRIMARY KEY (`id_question`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reponse` (
    `id_reponse` INTEGER NOT NULL AUTO_INCREMENT,
    `texte_reponse` VARCHAR(255) NOT NULL,
    `est_correcte` BOOLEAN NOT NULL,
    `id_question` INTEGER NOT NULL,

    PRIMARY KEY (`id_reponse`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `passage_evaluation` (
    `id_passage` INTEGER NOT NULL AUTO_INCREMENT,
    `score_obtenu` DOUBLE NOT NULL,
    `date_passage` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_utilisateur` INTEGER NOT NULL,
    `id_evaluation` INTEGER NOT NULL,

    PRIMARY KEY (`id_passage`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `utilisateur` ADD CONSTRAINT `utilisateur_id_role_fkey` FOREIGN KEY (`id_role`) REFERENCES `role`(`id_role`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parcours` ADD CONSTRAINT `parcours_id_createur_fkey` FOREIGN KEY (`id_createur`) REFERENCES `utilisateur`(`id_utilisateur`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluation` ADD CONSTRAINT `evaluation_id_parcours_fkey` FOREIGN KEY (`id_parcours`) REFERENCES `parcours`(`id_parcours`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `competence_utilisateur` ADD CONSTRAINT `competence_utilisateur_id_utilisateur_fkey` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur`(`id_utilisateur`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `competence_utilisateur` ADD CONSTRAINT `competence_utilisateur_id_competence_fkey` FOREIGN KEY (`id_competence`) REFERENCES `competence`(`id_competence`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question` ADD CONSTRAINT `question_id_evaluation_fkey` FOREIGN KEY (`id_evaluation`) REFERENCES `evaluation`(`id_evaluation`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question` ADD CONSTRAINT `question_id_competence_fkey` FOREIGN KEY (`id_competence`) REFERENCES `competence`(`id_competence`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reponse` ADD CONSTRAINT `reponse_id_question_fkey` FOREIGN KEY (`id_question`) REFERENCES `question`(`id_question`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `passage_evaluation` ADD CONSTRAINT `passage_evaluation_id_utilisateur_fkey` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur`(`id_utilisateur`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `passage_evaluation` ADD CONSTRAINT `passage_evaluation_id_evaluation_fkey` FOREIGN KEY (`id_evaluation`) REFERENCES `evaluation`(`id_evaluation`) ON DELETE RESTRICT ON UPDATE CASCADE;
