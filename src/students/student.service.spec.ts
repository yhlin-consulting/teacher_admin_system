import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Student } from './entities/student.entity';
import { StudentStatus } from '../common/student-status.enum';
import { NotFoundException } from '@nestjs/common';
import { DeepPartial } from 'typeorm';

describe('StudentService', () => {
  let service: StudentService;

  const mockQueryBuilder = {
    innerJoin: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    having: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
  };
  const mockTeacherRepo = {
    findOne: jest.fn(),
    create: jest
      .fn()
      .mockImplementation((dto: DeepPartial<Teacher>): Teacher => {
        return dto as Teacher;
      }),
    save: jest.fn(),
  };
  const mockStudentRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getRepositoryToken(Teacher),
          useValue: mockTeacherRepo,
        },
        {
          provide: getRepositoryToken(Student),
          useValue: mockStudentRepo,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerStudents', () => {
    it('should create a new teacher and students if they do not exist', async () => {
      mockTeacherRepo.findOne.mockResolvedValue(null);
      mockStudentRepo.findOne.mockResolvedValue(null);
      mockTeacherRepo.save.mockResolvedValue({
        id: 1,
        email: 'teacher@test.com',
        students: [],
      });
      mockStudentRepo.save.mockResolvedValue({
        id: 1,
        email: 'student@test.com',
      });

      // Act
      await service.registerStudents('teacher@test.com', ['student@test.com']);

      // Assert
      expect(mockTeacherRepo.save).toHaveBeenCalled();
      expect(mockStudentRepo.save).toHaveBeenCalled();
    });

    it('should associate existing students with an existing teacher', async () => {
      const existingTeacher = {
        id: 1,
        email: 'teacher@test.com',
        students: [],
      };
      const existingStudent = { id: 1, email: 'student@test.com' };

      mockTeacherRepo.findOne.mockResolvedValue(existingTeacher);
      mockStudentRepo.findOne.mockResolvedValue(existingStudent);

      // Act
      await service.registerStudents('teacher@test.com', ['student@test.com']);

      // Assert
      expect(mockTeacherRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          students: expect.arrayContaining([existingStudent]),
        }),
      );
    });
  });

  describe('getCommonStudents', () => {
    it('should return common student emails for multiple teachers', async () => {
      const teachers = ['teacher1@gmail.com', 'teacher2@gmail.com'];
      const dbResult = [
        { email: 'commonstudent1@gmail.com' },
        { email: 'commonstudent2@gmail.com' },
      ];

      mockQueryBuilder.getRawMany.mockResolvedValue(dbResult);

      const result = await service.getCommonStudents(teachers);

      expect(result).toEqual([
        'commonstudent1@gmail.com',
        'commonstudent2@gmail.com',
      ]);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'teacher.email IN (:...emails)',
        { emails: expect.arrayContaining(teachers) },
      );
      expect(mockQueryBuilder.having).toHaveBeenCalledWith(
        expect.stringContaining('COUNT(DISTINCT teacher.email) = :count'),
        { count: 2 },
      );
    });

    it('should handle a single teacher passed as a string', async () => {
      mockQueryBuilder.getRawMany.mockResolvedValue([
        { email: 'student1@gmail.com' },
      ]);

      const result = await service.getCommonStudents('teacher1@gmail.com');

      expect(result).toEqual(['student1@gmail.com']);
      expect(mockQueryBuilder.having).toHaveBeenCalledWith(expect.any(String), {
        count: 1,
      });
    });

    it('should return an empty array when no common students exist', async () => {
      mockQueryBuilder.getRawMany.mockResolvedValue([]);

      const result = await service.getCommonStudents(['teacher1@gmail.com']);

      expect(result).toEqual([]);
    });
  });

  describe('suspendStudent', () => {
    it('should change student status to SUSPENDED', async () => {
      const existingStudent = {
        id: 1,
        email: 'studentmary@gmail.com',
        status: StudentStatus.ACTIVE,
      };

      mockStudentRepo.findOne.mockResolvedValue(existingStudent);

      await service.suspendStudent('studentmary@gmail.com');

      expect(mockStudentRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'studentmary@gmail.com',
          status: StudentStatus.SUSPENDED,
        }),
      );
    });

    it('should throw NotFoundException for invalid email', async () => {
      mockStudentRepo.findOne.mockResolvedValue(null);

      await expect(service.suspendStudent('unknown@gmail.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getNotificationRecipients', () => {
    it('should return mentioned students even if not registered, and exclude suspended ones', async () => {
      const teacher = 'teacherken@gmail.com';
      const note = 'Hello! @mentioned@gmail.com';

      const dbResult = [
        { email: 'registered@gmail.com' },
        { email: 'mentioned@gmail.com' },
      ];

      mockQueryBuilder.getRawMany.mockResolvedValue(dbResult);

      const result = await service.getNotificationRecipients(teacher, note);

      expect(result).toEqual(['registered@gmail.com', 'mentioned@gmail.com']);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'student.status != :status',
        { status: StudentStatus.SUSPENDED },
      );
    });
  });
});
