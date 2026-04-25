import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { Student } from './student.entity';

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  email: string;

  @ManyToMany(() => Student, (student) => student.teachers)
  @JoinTable({ name: 'teacher_students_registration' })
  students: Student[];
}
