import {
  Controller, Post, Body, UseGuards,
  Get, Param, Delete,
} from '@nestjs/common';
import { EjercicioExaService } from '../services/ejercicio-exa.service';
import { CreateEjercicioExaDto } from '../dto/create-ejercicio-exa.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auht.guard';

@Controller('ejercicio-exa')
@UseGuards(JwtAuthGuard)
export class EjercicioExaController {
  constructor(private readonly svc: EjercicioExaService) {}

  @Post()
  create(@Body() dto: CreateEjercicioExaDto) {
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
