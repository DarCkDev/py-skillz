import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Examen } from './examen.entity';
import { EjercicioTipo } from './ejercicio-tipo.enum';

@Entity({ name: 'ejerciciosExa' })
@Index('idx_ejerexa_examen', ['examen'])
@Index('idx_ejerexa_tipo', ['tipo'])
export class EjercicioExa {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Examen, (e) => e.ejercicios, { onDelete: 'CASCADE' })
  examen: Examen;

  @Column({
    type: 'enum',
    enum: EjercicioTipo,
    enumName: 'ejercicio_tipo', // ¡mismo nombre que arriba para reutilizar!
  })
  tipo: EjercicioTipo;

  @Column({ type: 'jsonb' })
  contenido: Record<string, any>;
}
