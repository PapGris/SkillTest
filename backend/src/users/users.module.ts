import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { CompetencesModule } from '../competences/competences.module.js';
import { PassagesModule } from '../passages/passages.module.js';

@Module({
  imports: [CompetencesModule, PassagesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
