import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, Index,
} from 'typeorm';
import { Tema } from '../../tema/entities/tema.entity';
import { EjercicioExa } from '../entities/ejercicio-exa.entity';

@Entity('examenes')
@Index('idx_examenes_tema',['tema'])
export class Examen {
  @PrimaryGeneratedColumn() id: number;
  @ManyToOne(() => Tema, t => t.examenes, { onDelete:'CASCADE' })
  tema: Tema;
  @Column('smallint',{nullable:true}) tiempoExamen: number|null;

  @OneToMany(() => EjercicioExa, ee => ee.examen)
  ejercicios: EjercicioExa[];
}
