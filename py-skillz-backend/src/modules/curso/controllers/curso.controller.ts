import { Body, Controller, Post, Req, UseGuards, Get } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auht.guard';
import { CreateCursoDto } from '../dto/create-curso.dto';
import { CursoService } from '../services/curso.service';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { Role } from '../../user/entities/role.entity';
import { CreateTaskDto } from '../dto/create-task.dto';

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

  @Get('mis-cursos')
  async getMyCourses(@Req() req: Request) {
    if (!req.user) {
      throw new Error('Usuario no autenticado');
    }
    return this.cursoService.findByUser(req.user);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.TEACHER, Role.ADMIN)
  @Post('tasks')
  async createTask(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    return await this.cursoService.createTask(createTaskDto, req.user as any);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tasks/:courseId')
  async getTasksByCourse(@Req() req: Request) {
    const courseId = parseInt(req.params.courseId);
    return await this.cursoService.getTasksByCourse(courseId);
  }
}
