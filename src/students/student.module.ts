import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Student } from './entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, Student])],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
