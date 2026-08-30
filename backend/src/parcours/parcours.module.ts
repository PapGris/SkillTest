import { Module } from '@nestjs/common';
import { ParcoursService } from './parcours.service.js';
import { ParcoursController } from './parcours.controller.js';

@Module({
  controllers: [ParcoursController],
  providers: [ParcoursService],
  exports: [ParcoursService],
})
export class ParcoursModule {}
