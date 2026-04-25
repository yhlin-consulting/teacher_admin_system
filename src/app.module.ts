import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { Student } from './student.entity';
import { Teacher } from './teacher.entity';
import { TypeOrmModule, InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RegistrationModule } from './registration.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', // This refers to the service name in docker-compose.yml
      port: 3306,
      username: 'appuser',
      password: 'apppassword',
      database: 'mydb',
      entities: [Student, Teacher],
      synchronize: true, // set to false for production
    }),
    RegistrationModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async onModuleInit() {
    try {
      await this.dataSource.query('SELECT 1');
      this.logger.log('✅ Successfully connected to MySQL database!');
    } catch (error) {
      this.logger.error('❌ Database connection failed:', error);
    }
  }
}
