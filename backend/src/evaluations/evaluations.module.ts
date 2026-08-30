import { Module } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service.js';
import { EvaluationsController } from './evaluations.controller.js';
import { QuestionsController } from './questions.controller.js';
import { ReponsesController } from './reponses.controller.js';

@Module({
  controllers: [EvaluationsController, QuestionsController, ReponsesController],
  providers: [EvaluationsService],
  exports: [EvaluationsService],
})
export class EvaluationsModule {}
