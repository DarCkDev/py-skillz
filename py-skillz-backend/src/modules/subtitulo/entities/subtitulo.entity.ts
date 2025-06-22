import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, Index,
} from 'typeorm';
import { Tema } from '../../tema/entities/tema.entity';
import { Ejercicio } from '../../ejercicio/entities/ejercicio.entity';

@Entity('subtitulo')
@Index('idx_subtitulos_tema',['tema'])
export class Subtitulo {
  @PrimaryGeneratedColumn() id: number;
  @ManyToOne(() => Tema, t => t.subtitulos, { onDelete:'CASCADE' })
  tema: Tema;
  @Column({length:255}) titulo: string;
  @Column('text',{nullable:true}) contenidoHtml: string;
  @Column('text',{nullable:true}) videoUrl: string;
  @Column('text',{nullable:true}) documentoUrl: string;
  @Column('smallint',{default:0}) orden: number;

  @OneToMany(() => Ejercicio, e => e.subtitulo)
  ejercicios: Ejercicio[];
}
