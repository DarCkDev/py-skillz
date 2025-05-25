import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Modulo } from './modulo.entity';

@Entity({ name: 'cursos' })
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  titulo: string;

  @Column({ length: 50, nullable: true })
  idioma: string;

  @Column({ length: 50, nullable: true })
  nivel: string;

  @Column({ length: 50, nullable: true })
  licencia: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'text', nullable: true })
  imagenDestacada: string;

  /* ----- Relaciones ----- */
  @OneToMany(() => Modulo, (t) => t.curso)
  temas: Modulo[];
}
