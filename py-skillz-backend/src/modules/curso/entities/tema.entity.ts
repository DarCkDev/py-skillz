import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { Curso } from './curso.entity';
import { Subtitulo } from './subtitulo.entity';
import { Examen } from './examen.entity';

@Entity({ name: 'Tema' })
@Index('idx_temas_curso', ['curso'])
export class Tema {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Curso, (c) => c.temas, { onDelete: 'CASCADE' })
  curso: Curso;

  @Column({ length: 255 })
  titulo: string;

  @Column({ type: 'smallint', default: 0 })
  orden: number;

  /* ----- Relaciones ----- */
  @OneToMany(() => Subtitulo, (s) => s.tema)
  subtitulos: Subtitulo[];

  @OneToMany(() => Examen, (e) => e.tema)
  examenes: Examen[];
}
