import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  Index,
} from 'typeorm';
import { StudentStatus } from '../../common/student-status.enum';
import { Teacher } from './teacher.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  email: string;

  // This tells TypeORM to create an ENUM column in MySQL
  @Index()
  @Column({
    type: 'enum',
    enum: StudentStatus,
    default: StudentStatus.ACTIVE,
  })
  status: StudentStatus;

  @ManyToMany(() => Teacher, (teacher) => teacher.students)
  teachers: Teacher[];
}
