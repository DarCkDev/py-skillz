import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCursoDto } from '../dto/create-curso.dto';
import { Curso } from '../entities/curso.entity';
import { User } from '../../user/entities/user.entity';
import { PayloadDto } from 'src/modules/auth/dto/payload.dto';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../entities/task.entity';

@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(Curso) private readonly cursoRepo: Repository<Curso>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
  ) {}

  async create(dto: CreateCursoDto, user: PayloadDto): Promise<Curso> {
    const creador = await this.userRepo.findOne({ where: { id: user.sub } });
    if (!creador) throw new Error('Usuario no encontrado');
    const curso = this.cursoRepo.create({ ...dto, creador });
    await this.cursoRepo.save(curso);
    return this.cursoRepo.findOneOrFail({ where: { id: curso.id } });
  }

  findByUser(user: PayloadDto) {
    return this.cursoRepo.find({ where: { creador: { id: user.sub } } });
  }

  findAll() {
    return this.cursoRepo.find({ relations: ['creador'] });
  }

  findOne(id: number) {
    return this.cursoRepo.findOneOrFail({
      where: { id },
      relations: ['creador'],
    });
  }

  async createTask(dto: CreateTaskDto, user: PayloadDto) {
    const curso = await this.cursoRepo.findOneOrFail({
      where: { id: dto.courseId },
      relations: ['creador'],
    });
    if (curso.creador.id !== user.sub)
      throw new Error('Sin permiso para crear tarea');
    const task = this.taskRepo.create({
      ...dto,
      creator: { id: user.sub },
      course: { id: dto.courseId },
    });
    const saved = await this.taskRepo.save(task);
    return this.taskRepo.findOneOrFail({
      where: { id: saved.id },
      relations: ['creator', 'course'],
    });
  }

  getTasksByCourse(courseId: number) {
    return this.taskRepo.find({
      where: { course: { id: courseId } },
      relations: ['creator'],
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: number) {
    const res = await this.cursoRepo.delete(id);
    if (res.affected === 0) throw new Error(`Curso ${id} no encontrado`);
  }
}
