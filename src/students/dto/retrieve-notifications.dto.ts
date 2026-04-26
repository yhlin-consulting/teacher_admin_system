import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RetrieveNotificationsDto {
  @ApiProperty({
    description: 'The email of the teacher sending the notification',
    example: 'teacherken@gmail.com',
  })
  @IsEmail()
  teacher: string;

  @ApiProperty({
    description:
      'The notification text, which may contain @mentioned student emails',
    example: 'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com',
  })
  @IsString()
  notification: string;
}
