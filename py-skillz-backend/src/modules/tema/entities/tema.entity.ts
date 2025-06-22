import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, Index,
} from 'typeorm';
import { Curso } from '../../curso/entities/curso.entity';
import { Subtitulo } from '../../subtitulo/entities/subtitulo.entity';
import { Examen } from '../../examen/entities/examen.entity';

@Entity('tema')
@Index('idx_temas_curso',['curso'])
export class Tema {
  @PrimaryGeneratedColumn() id: number;
  @ManyToOne(() => Curso, c => c.temas, { onDelete:'CASCADE' })
  curso: Curso;
  @Column({ length:255 }) titulo: string;
  @Column({ type:'smallint',default:0 }) orden: number;

  @OneToMany(() => Subtitulo, s => s.tema)
  subtitulos: Subtitulo[];

  @OneToMany(() => Examen, e => e.tema)
  examenes: Examen[];
}
