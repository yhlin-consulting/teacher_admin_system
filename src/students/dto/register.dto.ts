import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsArray, ArrayNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'The email of the teacher',
    example: 'teacherken@gmail.com',
  })
  @IsEmail()
  teacher: string;

  @ApiProperty({
    description: 'List of student emails to register',
    example: ['studentjon@gmail.com', 'studenthon@gmail.com'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEmail({}, { each: true })
  students: string[];
}
