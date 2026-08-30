import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateCompetenceDto } from './dto/create-competence.dto.js';
import type { UpdateCompetenceDto } from './dto/update-competence.dto.js';

@Injectable()
export class CompetencesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.competence.findMany({ orderBy: { nomCompetence: 'asc' } });
  }

  async findOne(id: number) {
    const competence = await this.prisma.competence.findUnique({ where: { id } });
    if (!competence) {
      throw new NotFoundException(`Competence ${id} introuvable`);
    }
    return competence;
  }

  create(dto: CreateCompetenceDto) {
    return this.prisma.competence.create({ data: dto });
  }

  async update(id: number, dto: UpdateCompetenceDto) {
    await this.findOne(id);
    return this.prisma.competence.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.competence.delete({ where: { id } });
    return { success: true };
  }

  findMesCompetences(utilisateurId: number) {
    return this.prisma.competenceUtilisateur.findMany({
      where: { utilisateurId },
      include: { competence: true },
      orderBy: { competence: { nomCompetence: 'asc' } },
    });
  }

  async setNiveau(utilisateurId: number, competenceId: number, niveauEstime: number) {
    await this.findOne(competenceId);
    return this.prisma.competenceUtilisateur.upsert({
      where: { utilisateurId_competenceId: { utilisateurId, competenceId } },
      update: { niveauEstime },
      create: { utilisateurId, competenceId, niveauEstime },
      include: { competence: true },
    });
  }
}
