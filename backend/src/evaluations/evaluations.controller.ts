import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EvaluationsService } from './evaluations.service.js';
import { CreateEvaluationDto } from './dto/create-evaluation.dto.js';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto.js';
import { CreateQuestionDto } from './dto/create-question.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

const GESTIONNAIRES = ['Manager', 'Responsable RH'];

@Controller('evaluations')
@UseGuards(JwtAuthGuard)
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Get()
  findAll(@Query('parcoursId') parcoursId?: string) {
    return this.evaluationsService.findAll(parcoursId ? Number(parcoursId) : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationsService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(...GESTIONNAIRES)
  @Post()
  create(@Body() dto: CreateEvaluationDto) {
    return this.evaluationsService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles(...GESTIONNAIRES)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEvaluationDto) {
    return this.evaluationsService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(...GESTIONNAIRES)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationsService.remove(id);
  }

  @UseGuards(RolesGuard)
  @Roles(...GESTIONNAIRES)
  @Post(':id/questions')
  addQuestion(@Param('id', ParseIntPipe) evaluationId: number, @Body() dto: CreateQuestionDto) {
    return this.evaluationsService.addQuestion(evaluationId, dto);
  }
}
