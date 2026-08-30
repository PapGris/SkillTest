import { Module } from '@nestjs/common';
import { PassagesService } from './passages.service.js';
import { EvaluationPassagesController } from './evaluation-passages.controller.js';
import { MesPassagesController } from './mes-passages.controller.js';

@Module({
  controllers: [EvaluationPassagesController, MesPassagesController],
  providers: [PassagesService],
  exports: [PassagesService],
})
export class PassagesModule {}
