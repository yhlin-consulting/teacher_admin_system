import {
  Module,
  OnModuleInit,
  Logger,
  MiddlewareConsumer,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { Student } from './students/entities/student.entity';
import { Teacher } from './students/entities/teacher.entity';
import { TypeOrmModule, InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { StudentModule } from './students/student.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppLoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available everywhere
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: configService.get<number>('MYSQL_PORT'),
        username: configService.get<string>('MYSQL_USER'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DATABASE'),
        entities: [Student, Teacher],
        synchronize: true,
      }),
    }),
    StudentModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements OnModuleInit {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
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
