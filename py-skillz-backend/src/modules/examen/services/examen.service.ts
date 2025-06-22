import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Examen } from '../entities/examen.entity';
import { CreateExamenDto } from '../dto/create-examen.dto';

@Injectable()
export class ExamenService {
  constructor(
    @InjectRepository(Examen) private readonly repo: Repository<Examen>,
  ) {}

  create(dto: CreateExamenDto) {
    const ex = this.repo.create(dto);
    return this.repo.save(ex);
  }

  findOne(id: number) {
    return this.repo.findOneOrFail({ where:{id} });
  }

  findAll() {
    return this.repo.find();
  }

  async remove(id: number) {
    const res = await this.repo.delete(id);
    if (res.affected===0) throw new Error(`Examen ${id} no existe`);
  }
}
