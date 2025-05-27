import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { Tema } from './tema.entity';
import { EjercicioExa } from './ejercicio-exa.entity';

@Entity({ name: 'examenes' })
@Index('idx_examenes_tema', ['tema'])
export class Examen {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tema, (t) => t.examenes, { onDelete: 'CASCADE' })
  tema: Tema;

  // NULL = sin límite
  @Column({ type: 'smallint', nullable: true })
  tiempoExamen: number | null;

  /* ----- Relaciones ----- */
  @OneToMany(() => EjercicioExa, (ee) => ee.examen)
  ejercicios: EjercicioExa[];
}
