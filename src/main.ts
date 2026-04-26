import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  const config = new DocumentBuilder()
    .setTitle('Teacher Admin System APIs')
    .setDescription('API documentation for Teacher Admin System')
    .setVersion('1.0')
    .addTag('Students')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // docs will be at /api

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Error during startup:', err);
  process.exit(1);
});
