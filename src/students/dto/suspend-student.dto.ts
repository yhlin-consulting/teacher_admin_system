import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SuspendStudentDto {
  @ApiProperty({
    description: 'The email of the student to suspend',
    example: 'studentmary@gmail.com',
  })
  @IsEmail()
  student: string;
}
