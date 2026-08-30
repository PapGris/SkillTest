import { Injectable } from '@nestjs/common';
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

  create(data: Prisma.UtilisateurUncheckedCreateInput) {
    return this.prisma.utilisateur.create({
      data,
      include: { role: true },
    });
  }
}
