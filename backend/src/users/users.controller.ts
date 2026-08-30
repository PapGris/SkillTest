import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CompetencesService } from '../competences/competences.service.js';
import { PassagesService } from '../passages/passages.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

const GESTIONNAIRES = ['Manager', 'Responsable RH'];

/** Consultation des utilisateurs par un Manager/Responsable RH (jamais expose aux Collaborateurs) */
@Controller('utilisateurs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...GESTIONNAIRES)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly competencesService: CompetencesService,
    private readonly passagesService: PassagesService,
  ) {}

  @Get()
  findAll() {
    return this.usersService.findAllPourGestion();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOnePourGestion(id);
  }

  @Get(':id/competences')
  competencesDe(@Param('id', ParseIntPipe) id: number) {
    return this.competencesService.findMesCompetences(id);
  }

  @Get(':id/passages')
  passagesDe(@Param('id', ParseIntPipe) id: number) {
    return this.passagesService.findMine(id);
  }
}
