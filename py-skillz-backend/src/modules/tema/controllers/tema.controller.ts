import {
  Controller, Get, Param, Post, Body, UseGuards, Req, Delete,
} from '@nestjs/common';
import { TemaService } from '../services/tema.service';
import { CreateTemaDto } from '../dto/create-tema.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auht.guard';
import { Request } from 'express';

@Controller('tema')
@UseGuards(JwtAuthGuard)
export class TemaController {
  constructor(private readonly temaService: TemaService) {}

  @Post()
  create(@Body() dto: CreateTemaDto) {
    return this.temaService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.temaService.findOne(+id);
  }

  @Get()
  findAll() {
    return this.temaService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.temaService.remove(+id);
  }
}
