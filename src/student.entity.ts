import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { StudentStatus } from './student-status.enum';
import { Teacher } from './teacher.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  // This tells TypeORM to create an ENUM column in MySQL
  @Column({
    type: 'enum',
    enum: StudentStatus,
    default: StudentStatus.ACTIVE,
  })
  status: StudentStatus;

  @ManyToMany(() => Teacher, (teacher) => teacher.students)
  teachers: Teacher[];
}
