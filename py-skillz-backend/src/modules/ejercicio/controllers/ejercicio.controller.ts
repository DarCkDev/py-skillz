import {
  Controller, Post, Body, UseGuards,
  Get, Param, Delete,
} from '@nestjs/common';
import { EjercicioService } from '../services/ejercicio.service';
import { CreateEjercicioDto } from '../dto/create-ejercicio.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auht.guard';

@Controller('ejercicio')
@UseGuards(JwtAuthGuard)
export class EjercicioController {
  constructor(private readonly svc: EjercicioService) {}

  @Post()
  create(@Body() dto: CreateEjercicioDto) {
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
