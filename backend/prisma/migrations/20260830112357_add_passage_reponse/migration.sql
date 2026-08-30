-- CreateTable
CREATE TABLE `passage_reponse` (
    `id_passage_reponse` INTEGER NOT NULL AUTO_INCREMENT,
    `id_passage` INTEGER NOT NULL,
    `id_question` INTEGER NOT NULL,
    `id_reponse` INTEGER NOT NULL,

    UNIQUE INDEX `passage_reponse_id_passage_id_reponse_key`(`id_passage`, `id_reponse`),
    PRIMARY KEY (`id_passage_reponse`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `passage_reponse` ADD CONSTRAINT `passage_reponse_id_passage_fkey` FOREIGN KEY (`id_passage`) REFERENCES `passage_evaluation`(`id_passage`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `passage_reponse` ADD CONSTRAINT `passage_reponse_id_question_fkey` FOREIGN KEY (`id_question`) REFERENCES `question`(`id_question`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `passage_reponse` ADD CONSTRAINT `passage_reponse_id_reponse_fkey` FOREIGN KEY (`id_reponse`) REFERENCES `reponse`(`id_reponse`) ON DELETE RESTRICT ON UPDATE CASCADE;
