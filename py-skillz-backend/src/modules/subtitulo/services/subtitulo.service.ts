import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subtitulo } from '../entities/subtitulo.entity';
import { CreateSubtituloDto } from '../dto/create-subtitulo.dto';

@Injectable()
export class SubtituloService {
  constructor(
    @InjectRepository(Subtitulo) private readonly repo: Repository<Subtitulo>,
  ) {}

  create(dto: CreateSubtituloDto) {
    const sub = this.repo.create(dto);
    return this.repo.save(sub);
  }

  findOne(id: number) {
    return this.repo.findOneOrFail({where:{id}});
  }

  findAll() {
    return this.repo.find();
  }

  async remove(id: number) {
    const res = await this.repo.delete(id);
    if (res.affected===0) throw new Error(`Subtitulo ${id} no existe`);
  }
}
