import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tema } from '../entities/tema.entity';
import { CreateTemaDto } from '../dto/create-tema.dto';

@Injectable()
export class TemaService {
  constructor(
    @InjectRepository(Tema) private readonly repo: Repository<Tema>,
  ) {}

  create(dto: CreateTemaDto) {
    const tema = this.repo.create(dto);
    return this.repo.save(tema);
  }

  findOne(id: number) {
    return this.repo.findOneOrFail({ where:{id} });
  }

  findAll() {
    return this.repo.find();
  }

  async remove(id: number) {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new Error(`Tema ${id} no encontrado`);
  }
}
