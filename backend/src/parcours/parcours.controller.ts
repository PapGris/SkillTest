import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ParcoursService } from './parcours.service.js';
import { CreateParcoursDto } from './dto/create-parcours.dto.js';
import { UpdateParcoursDto } from './dto/update-parcours.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser, type AuthenticatedUser } from '../common/decorators/current-user.decorator.js';

const GESTIONNAIRES = ['Manager', 'Responsable RH'];

@Controller('parcours')
@UseGuards(JwtAuthGuard)
export class ParcoursController {
  constructor(private readonly parcoursService: ParcoursService) {}

  @Get()
  findAll() {
    return this.parcoursService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.parcoursService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(...GESTIONNAIRES)
  @Post()
  create(@Body() dto: CreateParcoursDto, @CurrentUser() user: AuthenticatedUser) {
    return this.parcoursService.create(dto, user.userId);
  }

  @UseGuards(RolesGuard)
  @Roles(...GESTIONNAIRES)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateParcoursDto) {
    return this.parcoursService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(...GESTIONNAIRES)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.parcoursService.remove(id);
  }
}
