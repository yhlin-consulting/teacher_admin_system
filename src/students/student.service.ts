import { Teacher } from './entities/teacher.entity';
import { Student } from './entities/student.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { StudentStatus } from '../common/student-status.enum';

interface StudentEmailRow {
  email: string;
}

@Injectable()
export class StudentService {
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

  async getCommonStudents(teachers: string | string[]): Promise<string[]> {
    const teacherList = Array.isArray(teachers) ? teachers : [teachers];
    const uniqueTeachers = [...new Set(teacherList)]; // Remove duplicates

    const students: StudentEmailRow[] = await this.studentRepo
      .createQueryBuilder('student')
      .innerJoin('student.teachers', 'teacher')
      .where('teacher.email IN (:...emails)', { emails: uniqueTeachers })
      .groupBy('student.email')
      .having('COUNT(DISTINCT teacher.email) = :count', {
        count: uniqueTeachers.length,
      })
      .select('student.email', 'email')
      .getRawMany();

    return students.map((s) => s.email);
  }

  async suspendStudent(studentEmail: string): Promise<void> {
    const student = await this.studentRepo.findOne({
      where: { email: studentEmail },
    });

    if (!student) {
      throw new NotFoundException(
        `Student with email ${studentEmail} not found`,
      );
    }

    student.status = StudentStatus.SUSPENDED;

    await this.studentRepo.save(student);
  }

  async getNotificationRecipients(
    teacherEmail: string,
    notification: string,
  ): Promise<string[]> {
    const mentionedEmails = this.extractMentions(notification);

    // Students registered to the teacher OR students in the mentioned list
    // AND student MUST NOT be suspended
    const students: StudentEmailRow[] = await this.studentRepo
      .createQueryBuilder('student')
      .leftJoin('student.teachers', 'teacher')
      .where('student.status != :status', { status: StudentStatus.SUSPENDED })
      .andWhere(
        new Brackets((qb) => {
          qb.where('teacher.email = :teacherEmail', { teacherEmail }).orWhere(
            'student.email IN (:...mentioned)',
            {
              mentioned: mentionedEmails.length > 0 ? mentionedEmails : [''],
            },
          );
        }),
      )
      .select('student.email', 'email')
      .getRawMany();

    return students.map((s) => s.email);
  }

  private extractMentions(text: string): string[] {
    // Regex to find emails preceded by @
    const mentionRegex = /@([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
    const matches = text.match(mentionRegex);
    if (!matches) return [];
    // Remove the '@' character from the start of each match
    return matches.map((m) => m.substring(1));
  }
}
