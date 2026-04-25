import { RegistrationService } from './registration.service';
import { RegisterDto } from './register.dto';
import { Controller, HttpCode, Post, HttpStatus, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Registration')
@Controller('api')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

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
    await this.registrationService.registerStudents(
      registerDto.teacher,
      registerDto.students,
    );
  }
}
