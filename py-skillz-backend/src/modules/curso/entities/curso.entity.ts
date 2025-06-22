import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToMany, ManyToOne,
} from 'typeorm';
import { Tema } from '../../tema/entities/tema.entity';
import { User } from '../../../user/entities/user.entity';
import { Task } from './task.entity';

@Entity('cursos')
export class Curso {
  @PrimaryGeneratedColumn() id: number;
  @Column({ length:255 }) titulo: string;
  @Column({ length:50, nullable:true }) idioma: string;
  @Column({ length:50, nullable:true }) nivel: string;
  @Column({ length:50, nullable:true }) licencia: string;
  @Column({ type:'text', nullable:true }) descripcion: string;
  @Column({ type:'text', nullable:true }) imagenDestacada: string;

  @OneToMany(() => Tema, t => t.curso, { cascade:true, eager:true })
  temas: Tema[];

  @ManyToOne(() => User, u => u.cursos, { onDelete:'CASCADE' })
  creador: User;

  @OneToMany(() => Task, task => task.course, { cascade:true })
  tasks: Task[];
}
