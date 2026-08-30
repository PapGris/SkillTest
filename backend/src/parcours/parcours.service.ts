import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateParcoursDto } from './dto/create-parcours.dto.js';
import type { UpdateParcoursDto } from './dto/update-parcours.dto.js';

@Injectable()
export class ParcoursService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.parcours.findMany({
      include: {
        createur: { select: { id: true, nom: true, prenom: true } },
        _count: { select: { evaluations: true } },
      },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const parcours = await this.prisma.parcours.findUnique({
      where: { id },
      include: {
        createur: { select: { id: true, nom: true, prenom: true } },
        evaluations: true,
      },
    });
    if (!parcours) {
      throw new NotFoundException(`Parcours ${id} introuvable`);
    }
    return parcours;
  }

  create(dto: CreateParcoursDto, createurId: number) {
    return this.prisma.parcours.create({ data: { ...dto, createurId } });
  }

  async update(id: number, dto: UpdateParcoursDto) {
    await this.ensureExists(id);
    return this.prisma.parcours.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    try {
      await this.prisma.parcours.delete({ where: { id } });
      return { success: true };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new ConflictException(
          'Impossible de supprimer ce parcours : il contient encore des evaluations. Supprime-les d\'abord.',
        );
      }
      throw error;
    }
  }

  private async ensureExists(id: number) {
    const exists = await this.prisma.parcours.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException(`Parcours ${id} introuvable`);
    }
  }
}
