import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PassagesService } from './passages.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { CurrentUser, type AuthenticatedUser } from '../common/decorators/current-user.decorator.js';

/** Historique des tentatives de l'utilisateur connecte */
@Controller('me/passages')
@UseGuards(JwtAuthGuard)
export class MesPassagesController {
  constructor(private readonly passagesService: PassagesService) {}

  @Get()
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.passagesService.findMine(user.userId);
  }

  @Get(':id')
  findOneMine(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthenticatedUser) {
    return this.passagesService.findOneMine(id, user.userId);
  }
}
