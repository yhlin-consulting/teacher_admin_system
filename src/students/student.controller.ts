import { StudentService } from './student.service';
import { RegisterDto } from './dto/register.dto';
import { SuspendStudentDto } from './dto/suspend-student.dto';
import { RetrieveNotificationsDto } from './dto/retrieve-notifications.dto';
import {
  Controller,
  HttpCode,
  Post,
  HttpStatus,
  Body,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Students')
@Controller('api')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register one or more students to a teacher' })
  @ApiResponse({
    status: 204,
    description: 'Students registered successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request (Validation failed).' })
  @ApiBody({ type: RegisterDto })
  @HttpCode(HttpStatus.NO_CONTENT) // 204 status
  async register(@Body() registerDto: RegisterDto) {
    await this.studentService.registerStudents(
      registerDto.teacher,
      registerDto.students,
    );
  }

  @Get('commonstudents')
  @ApiOperation({ summary: 'Retrieve students common to a list of teachers' })
  @ApiResponse({ status: 200, description: 'Success' })
  async getCommonStudents(@Query('teacher') teacher: string | string[] = []) {
    if (!teacher || (Array.isArray(teacher) && teacher.length === 0)) {
      throw new BadRequestException(
        'At least one teacher email must be provided',
      );
    }
    const studentEmails = await this.studentService.getCommonStudents(teacher);

    return {
      students: studentEmails,
    };
  }

  @Post('suspend')
  @ApiOperation({ summary: 'Suspend a specified student' })
  @ApiResponse({ status: 204, description: 'Student successfully suspended.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  @HttpCode(HttpStatus.NO_CONTENT) // Sets response status to 204
  async suspend(@Body() suspendDto: SuspendStudentDto) {
    await this.studentService.suspendStudent(suspendDto.student);
  }

  @Post('retrievefornotifications')
  @Post('retrievefornotifications')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve students who can receive a notification' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved list of recipients.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @HttpCode(HttpStatus.OK)
  async retrieveForNotifications(@Body() dto: RetrieveNotificationsDto) {
    const recipients = await this.studentService.getNotificationRecipients(
      dto.teacher,
      dto.notification,
    );

    return { recipients };
  }
}
