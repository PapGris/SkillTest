import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service.js';
import { UpdateQuestionDto } from './dto/update-question.dto.js';
import { CreateReponseDto } from './dto/create-reponse.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

const GESTIONNAIRES = ['Manager', 'Responsable RH'];

@Controller('questions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...GESTIONNAIRES)
export class QuestionsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateQuestionDto) {
    return this.evaluationsService.updateQuestion(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationsService.removeQuestion(id);
  }

  @Post(':id/reponses')
  addReponse(@Param('id', ParseIntPipe) questionId: number, @Body() dto: CreateReponseDto) {
    return this.evaluationsService.addReponse(questionId, dto);
  }
}
