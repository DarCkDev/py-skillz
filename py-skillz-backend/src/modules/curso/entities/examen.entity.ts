import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { Modulo } from './modulo.entity';
import { EjercicioExa } from './ejercicio-exa.entity';

@Entity({ name: 'examenes' })
@Index('idx_examenes_tema', ['modulo'])
export class Examen {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Modulo, (t) => t.examenes, { onDelete: 'CASCADE' })
  modulo: Modulo;

  // NULL = sin límite
  @Column({ type: 'smallint', nullable: true })
  tiempoExamen: number | null;

  /* ----- Relaciones ----- */
  @OneToMany(() => EjercicioExa, (ee) => ee.examen)
  ejercicios: EjercicioExa[];
}
