import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ejercicio } from '../entities/ejercicio.entity';
import { CreateEjercicioDto } from '../dto/create-ejercicio.dto';

@Injectable()
export class EjercicioService {
  constructor(
    @InjectRepository(Ejercicio) private readonly repo: Repository<Ejercicio>,
  ) {}

  create(dto: CreateEjercicioDto) {
    const e = this.repo.create({
      subtitulo: { id: dto.subtituloId },
      tipo: dto.tipo,
      contenido: { ...dto },
    });
    return this.repo.save(e);
  }

  findOne(id: number) {
    return this.repo.findOneOrFail({ where:{id} });
  }

  findAll() {
    return this.repo.find();
  }

  async remove(id: number) {
    const res = await this.repo.delete(id);
    if (res.affected===0) throw new Error(`Ejercicio ${id} no existe`);
  }
}
