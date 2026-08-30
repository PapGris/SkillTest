import { Module } from '@nestjs/common';
import { CompetencesService } from './competences.service.js';
import { CompetencesController } from './competences.controller.js';
import { MesCompetencesController } from './mes-competences.controller.js';

@Module({
  controllers: [CompetencesController, MesCompetencesController],
  providers: [CompetencesService],
  exports: [CompetencesService],
})
export class CompetencesModule {}
