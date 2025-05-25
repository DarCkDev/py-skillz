import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { Curso } from './curso.entity';
import { Subtitulo } from './tema.entity';
import { Examen } from './examen.entity';

@Entity({ name: 'temas' })
@Index('idx_temas_curso', ['curso'])
export class Modulo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Curso, (c) => c.temas, { onDelete: 'CASCADE' })
  curso: Curso;

  @Column({ length: 255 })
  titulo: string;

  @Column({ type: 'smallint', default: 0 })
  orden: number;

  /* ----- Relaciones ----- */
  @OneToMany(() => Subtitulo, (s) => s.modulo)
  subtitulos: Subtitulo[];

  @OneToMany(() => Examen, (e) => e.modulo)
  examenes: Examen[];
}
