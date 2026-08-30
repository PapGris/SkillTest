/*
  Warnings:

  - A unique constraint covering the columns `[nom_competence]` on the table `competence` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `competence_nom_competence_key` ON `competence`(`nom_competence`);
