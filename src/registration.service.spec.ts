import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationService } from './registration.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Teacher } from './teacher.entity';
import { Student } from './student.entity';

describe('RegistrationService', () => {
  let service: RegistrationService;

  const mockTeacherRepo = {
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn(),
  };
  const mockStudentRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationService,
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

    service = module.get<RegistrationService>(RegistrationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new teacher and students if they do not exist', async () => {
    mockTeacherRepo.findOne.mockResolvedValue(null);
    mockStudentRepo.findOne.mockResolvedValue(null);
    mockTeacherRepo.save.mockResolvedValue({
      id: 1,
      email: 'teacher@test.com',
      students: []
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
    const existingTeacher = { id: 1, email: 'teacher@test.com', students: [] };
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
