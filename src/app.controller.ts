import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getApiInfo() {
    return {
      name: 'Teacher Admin System APIs',
      description: 'A service for teachers to manage students',
      version: '1.0.0',
      links: {
        docs: '/api',
      },
      timestamp: new Date().toISOString(),
    };
  }
}
