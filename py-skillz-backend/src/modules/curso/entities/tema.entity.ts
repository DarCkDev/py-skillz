import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { Modulo } from './modulo.entity';
import { Ejercicio } from './ejercicio.entity';

@Entity({ name: 'temas' })
@Index('idx_subtitulos_tema', ['modulo'])
export class Subtitulo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Modulo, (t) => t.subtitulos, { onDelete: 'CASCADE' })
  modulo: Modulo;

  @Column({ length: 255 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  contenidoHtml: string;

  @Column({ type: 'text', nullable: true })
  videoUrl: string;

  @Column({ type: 'text', nullable: true })
  documentoUrl: string;

  @Column({ type: 'smallint', default: 0 })
  orden: number;

  /* ----- Relaciones ----- */
  @OneToMany(() => Ejercicio, (e) => e.subtitulo)
  ejercicios: Ejercicio[];
}
