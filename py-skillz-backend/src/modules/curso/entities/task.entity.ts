import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn,
} from 'typeorm';
import { Curso } from './curso.entity';
import { User } from '../../../user/entities/user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn() id: number;
  @Column({ length:255 }) title: string;
  @Column('text') description: string;
  @Column('text') instructions: string;
  @Column('text',{nullable:true}) fileUrl: string;
  @Column('varchar',{length:100,nullable:true}) tag: string;
  @Column('text',{nullable:true}) objectives: string;
  @Column('timestamp',{nullable:true}) deadline: Date;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;

  @ManyToOne(() => Curso, c => c.tasks, { onDelete:'CASCADE' })
  @JoinColumn({ name:'courseId' }) course: Curso;

  @ManyToOne(() => User, u => u.tasks)
  @JoinColumn({ name:'creatorId' }) creator: User;
}
