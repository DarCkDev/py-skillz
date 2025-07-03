import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EjercicioExa } from '../entities/ejercicio-exa.entity';
import { CreateEjercicioExaDto } from '../dto/create-ejercicio-exa.dto';

@Injectable()
export class EjercicioExaService {
  constructor(
    @InjectRepository(EjercicioExa)
    private readonly repo: Repository<EjercicioExa>,
  ) {}

  create(dto: CreateEjercicioExaDto) {
    const ee = this.repo.create({ tipo: dto.tipo, contenido: { ...dto } });
    return this.repo.save(ee);
  }

  findOne(id: number) {
    return this.repo.findOneOrFail({ where:{id} });
  }

  findAll() {
    return this.repo.find();
  }

  async remove(id: number) {
    const res = await this.repo.delete(id);
    if (res.affected===0) throw new Error(`EjerExa ${id} no existe`);
  }
}
