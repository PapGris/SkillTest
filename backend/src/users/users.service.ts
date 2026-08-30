import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.utilisateur.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  findById(id: number) {
    return this.prisma.utilisateur.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  // ---------- Methodes pour la gestion (Manager/RH) : jamais de mot de passe dans le select ----------

  findAllPourGestion() {
    return this.prisma.utilisateur.findMany({
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        createdAt: true,
        role: { select: { nomRole: true } },
      },
      orderBy: [{ role: { nomRole: 'asc' } }, { nom: 'asc' }],
    });
  }

  async findOnePourGestion(id: number) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        createdAt: true,
        role: { select: { nomRole: true } },
      },
    });
    if (!utilisateur) {
      throw new NotFoundException(`Utilisateur ${id} introuvable`);
    }
    return utilisateur;
  }

  create(data: Prisma.UtilisateurUncheckedCreateInput) {
    return this.prisma.utilisateur.create({
      data,
      include: { role: true },
    });
  }
}
