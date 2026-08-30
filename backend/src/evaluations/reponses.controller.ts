import { Body, Controller, Delete, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service.js';
import { UpdateReponseDto } from './dto/update-reponse.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

const GESTIONNAIRES = ['Manager', 'Responsable RH'];

@Controller('reponses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...GESTIONNAIRES)
export class ReponsesController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReponseDto) {
    return this.evaluationsService.updateReponse(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationsService.removeReponse(id);
  }
}
