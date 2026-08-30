import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CompetencesService } from './competences.service.js';
import { CreateCompetenceDto } from './dto/create-competence.dto.js';
import { UpdateCompetenceDto } from './dto/update-competence.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

const RH = 'Responsable RH';

@Controller('competences')
@UseGuards(JwtAuthGuard)
export class CompetencesController {
  constructor(private readonly competencesService: CompetencesService) {}

  @Get()
  findAll() {
    return this.competencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.competencesService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(RH)
  @Post()
  create(@Body() dto: CreateCompetenceDto) {
    return this.competencesService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles(RH)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCompetenceDto) {
    return this.competencesService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(RH)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.competencesService.remove(id);
  }
}
