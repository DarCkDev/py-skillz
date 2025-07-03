import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, Index,
} from 'typeorm';
import { Examen } from '../../examen/entities/examen.entity';
import { EjercicioTipo } from '../../ejercicio/entities/ejercicio-tipo.enum';

@Entity('ejerciciosExa')
@Index('idx_ejerexa_examen',['examen'])
@Index('idx_ejerexa_tipo',['tipo'])
export class EjercicioExa {
  @PrimaryGeneratedColumn() id: number;
  @ManyToOne(() => Examen, e => e.ejercicios, { onDelete:'CASCADE' })
  examen: Examen;
  @Column({
    type:'enum', enum:EjercicioTipo, enumName:'ejercicio_tipo',
  }) tipo: EjercicioTipo;
  @Column('jsonb') contenido: Record<string, any>;
}
