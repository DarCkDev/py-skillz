import {
  Controller, Post, Body, UseGuards,
  Get, Param, Delete,
} from '@nestjs/common';
import { SubtituloService } from '../services/subtitulo.service';
import { CreateSubtituloDto } from '../dto/create-subtitulo.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auht.guard';

@Controller('subtitulo')
@UseGuards(JwtAuthGuard)
export class SubtituloController {
  constructor(private readonly svc: SubtituloService) {}

  @Post()
  create(@Body() dto: CreateSubtituloDto) {
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
