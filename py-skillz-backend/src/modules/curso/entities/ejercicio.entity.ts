import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Subtitulo } from './tema.entity';
import { EjercicioTipo } from './ejercicio-tipo.enum';

@Entity({ name: 'ejercicios' })
@Index('idx_ejercicios_subtitulo', ['subtitulo'])
@Index('idx_ejercicios_tipo', ['tipo'])
export class Ejercicio {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Subtitulo, (s) => s.ejercicios, { onDelete: 'CASCADE' })
  subtitulo: Subtitulo;

  @Column({
    type: 'enum',
    enum: EjercicioTipo,
    enumName: 'ejercicio_tipo',
  })
  tipo: EjercicioTipo;

  @Column({ type: 'text' })
  pregunta: string;

  @Column({ type: 'jsonb', nullable: true })
  contenido: Record<string, any>;
}
