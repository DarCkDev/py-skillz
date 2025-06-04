import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Curso } from './curso.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  instructions: string;

  @Column({ type: 'text', nullable: true })
  fileUrl: string;
  
  @Column({ type: 'varchar', length: 100, nullable: true })
  tag: string;

  @Column({ type: 'text', nullable: true })
  objectives: string;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Curso, (curso) => curso.tasks, { 
    onDelete: 'CASCADE',
    nullable: false 
  })
  @JoinColumn({ name: 'courseId' })
  course: Curso;

  @ManyToOne(() => User, (user) => user.tasks, { 
    nullable: false 
  })
  @JoinColumn({ name: 'creatorId' })
  creator: User;
} 