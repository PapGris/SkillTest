import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { UsersService } from '../users/users.service.js';
import type { RegisterDto } from './dto/register.dto.js';
import type { LoginDto } from './dto/login.dto.js';

const ROLE_PAR_DEFAUT = 'Collaborateur';
const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Un compte existe deja avec cet email');
    }

    const role = await this.prisma.role.findUnique({ where: { nomRole: ROLE_PAR_DEFAUT } });
    if (!role) {
      throw new Error(`Role par defaut "${ROLE_PAR_DEFAUT}" introuvable : as-tu lance le seed ? (npm run prisma:seed)`);
    }

    const motDePasseHash = await bcrypt.hash(dto.motDePasse, SALT_ROUNDS);

    const user = await this.usersService.create({
      nom: dto.nom,
      prenom: dto.prenom,
      email: dto.email,
      motDePasse: motDePasseHash,
      roleId: role.id,
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const motDePasseValide = await bcrypt.compare(dto.motDePasse, user.motDePasse);
    if (!motDePasseValide) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: { id: number; nom: string; prenom: string; email: string; role: { nomRole: string } }) {
    const payload = { sub: user.id, email: user.email, role: user.role.nomRole };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role.nomRole,
      },
    };
  }
}
