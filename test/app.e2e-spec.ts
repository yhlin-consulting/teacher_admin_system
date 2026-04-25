import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { Student } from '../src/students/entities/student.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('name', 'Teacher Admin System APIs');
        expect(res.body).toHaveProperty('links');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});

describe('Student Controller (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = app.get(DataSource);

    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      // TRUNCATE is faster and resets IDs, but DELETE works too
      // In MySQL, we disable foreign key checks briefly to clear everything
      await repository.query('SET FOREIGN_KEY_CHECKS = 0;');
      // await repository.query(`DELETE FROM ${entity.tableName}`);
      await dataSource.query('DELETE FROM teacher_students_registration;');
      await dataSource.query('DELETE FROM student;');
      await dataSource.query('DELETE FROM teacher;');
      await repository.query('SET FOREIGN_KEY_CHECKS = 1;');
    }
  });

  afterAll(async () => {
    await app.close();
  });

  // Story 1: Register
  it('/api/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/register')
      .send({
        teacher: 'teacherken@gmail.com',
        students: ['studentjon@gmail.com', 'studenthon@gmail.com'],
      })
      .expect(204);
  });

  // Story 2: Common Students
  it('/api/commonstudents (GET)', async () => {
    // Setup: Register student under two teachers
    await request(app.getHttpServer())
      .post('/api/register')
      .send({
        teacher: 'teacher1@gmail.com',
        students: ['common@gmail.com'],
      });
    await request(app.getHttpServer())
      .post('/api/register')
      .send({
        teacher: 'teacher2@gmail.com',
        students: ['common@gmail.com'],
      });

    const res = await request(app.getHttpServer())
      .get('/api/commonstudents')
      .query('teacher=teacher1@gmail.com&teacher=teacher2@gmail.com')
      .expect(200);

    const { students } = res.body as { students: string[] };
    expect(students).toContain('common@gmail.com');
  });

  // Story 3: Suspend
  it('/api/suspend (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/suspend')
      .send({ student: 'studentjon@gmail.com' })
      .expect(204);
  });

  // Story 4: Notifications
  it('/api/retrievefornotifications (POST) - should accurately filter recipients', async () => {
    // Use a TOTALLY unique email here - one that is NOT in any other test file
    const uniqueTeacher = 'unique-test-teacher-999@gmail.com';
    const registeredEmail = 'registered@gmail.com';
    const mentionedEmail = 'mentioned@gmail.com';

    // Setup: Register
    await request(app.getHttpServer())
      .post('/api/register')
      .send({
        teacher: uniqueTeacher,
        students: [registeredEmail],
      });

    // Setup: Create the mentioned student
    await dataSource.getRepository(Student).save({
      email: mentionedEmail,
      isSuspended: false,
    });

    // Action
    const res = await request(app.getHttpServer())
      .post('/api/retrievefornotifications')
      .send({
        teacher: uniqueTeacher,
        notification: `Hello @${mentionedEmail}`,
      });

    const { recipients } = res.body as { recipients: string[] };

    expect(recipients).toContain(registeredEmail);
    expect(recipients).toContain(mentionedEmail);
    expect(recipients).toHaveLength(2);
  });
});
