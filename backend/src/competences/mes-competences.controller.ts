import { Body, Controller, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { CompetencesService } from './competences.service.js';
import { SetNiveauDto } from './dto/set-niveau.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { CurrentUser, type AuthenticatedUser } from '../common/decorators/current-user.decorator.js';

/** Auto-evaluation des competences par l'utilisateur connecte (table Competence_Utilisateur du MLD) */
@Controller('me/competences')
@UseGuards(JwtAuthGuard)
export class MesCompetencesController {
  constructor(private readonly competencesService: CompetencesService) {}

  @Get()
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.competencesService.findMesCompetences(user.userId);
  }

  @Put(':competenceId')
  setNiveau(
    @CurrentUser() user: AuthenticatedUser,
    @Param('competenceId', ParseIntPipe) competenceId: number,
    @Body() dto: SetNiveauDto,
  ) {
    return this.competencesService.setNiveau(user.userId, competenceId, dto.niveauEstime);
  }
}
