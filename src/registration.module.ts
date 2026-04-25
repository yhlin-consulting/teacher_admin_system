import { Module } from '@nestjs/common';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './teacher.entity';
import { Student } from './student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, Student])],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class RegistrationModule {}
