import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { PassagesService } from './passages.service.js';
import { PasserEvaluationDto } from './dto/passer-evaluation.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser, type AuthenticatedUser } from '../common/decorators/current-user.decorator.js';

const GESTIONNAIRES = ['Manager', 'Responsable RH'];

@Controller('evaluations/:evaluationId/passages')
@UseGuards(JwtAuthGuard)
export class EvaluationPassagesController {
  constructor(private readonly passagesService: PassagesService) {}

  /** Un utilisateur connecte passe l'evaluation et soumet ses reponses */
  @Post()
  passer(
    @Param('evaluationId', ParseIntPipe) evaluationId: number,
    @Body() dto: PasserEvaluationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.passagesService.passerEvaluation(evaluationId, user.userId, dto);
  }

  /** Manager/RH : toutes les tentatives faites sur cette evaluation (reporting) */
  @UseGuards(RolesGuard)
  @Roles(...GESTIONNAIRES)
  @Get()
  findAllForEvaluation(@Param('evaluationId', ParseIntPipe) evaluationId: number) {
    return this.passagesService.findAllForEvaluation(evaluationId);
  }
}
