import {
  Controller, Post, Body, UseGuards,
  Get, Param, Delete,
} from '@nestjs/common';
import { ExamenService } from '../services/examen.service';
import { CreateExamenDto } from '../dto/create-examen.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auht.guard';

@Controller('examen')
@UseGuards(JwtAuthGuard)
export class ExamenController {
  constructor(private readonly svc: ExamenService) {}

  @Post()
  create(@Body() dto: CreateExamenDto) {
    return this.svc.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(+id);
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(+id);
  }
}
