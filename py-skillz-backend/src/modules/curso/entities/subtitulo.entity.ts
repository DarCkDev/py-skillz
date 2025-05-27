import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { Tema } from './tema.entity';
import { Ejercicio } from './ejercicio.entity';

@Entity({ name: 'subtitulo' })
@Index('idx_subtitulos_tema', ['tema'])
export class Subtitulo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tema, (t) => t.subtitulos, { onDelete: 'CASCADE' })
  tema: Tema;

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
