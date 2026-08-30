import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CommonModule } from './common/common.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { CompetencesModule } from './competences/competences.module.js';
import { ParcoursModule } from './parcours/parcours.module.js';
import { EvaluationsModule } from './evaluations/evaluations.module.js';
import { PassagesModule } from './passages/passages.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    CompetencesModule,
    ParcoursModule,
    EvaluationsModule,
    PassagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
