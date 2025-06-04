import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auht.guard';
import { CreateCursoDto } from '../dto/create-curso.dto';
import { CursoService } from '../services/curso.service';

@Controller('curso')
@UseGuards(JwtAuthGuard)
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @Post()
  async create(@Body() createCursoDto: CreateCursoDto, @Req() req: Request) {
    if (!req.user) {
      throw new Error('Usuario no autenticado');
    }
    return this.cursoService.create(createCursoDto, req.user);
  }
}
