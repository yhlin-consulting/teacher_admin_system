import { Teacher } from './teacher.entity';
import { Student } from './student.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
  ) {}

  async registerStudents(
    teacherEmail: string,
    studentEmails: string[],
  ): Promise<void> {
    // 1. Get or Create the Teacher
    let teacher = await this.teacherRepo.findOne({
      where: { email: teacherEmail },
      relations: ['students'],
    });

    if (!teacher) {
      teacher = this.teacherRepo.create({ email: teacherEmail, students: [] });
    }

    // 2. Get or Create the Students
    const studentEntities = await Promise.all(
      studentEmails.map(async (email) => {
        let student = await this.studentRepo.findOne({ where: { email } });
        if (!student) {
          student = this.studentRepo.create({ email });
          await this.studentRepo.save(student);
        }
        return student;
      }),
    );

    // 3. Update the association (merge unique students)
    const existingStudentIds = (teacher.students || []).map((s) => s.id);
    const newStudents = studentEntities.filter(
      (s) => s && s.id && !existingStudentIds.includes(s.id),
    );

    teacher.students.push(...newStudents);
    await this.teacherRepo.save(teacher);
  }
}
