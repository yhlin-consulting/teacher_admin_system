import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Teacher Admin System APIs')
    .setDescription('API documentation for Teacher Admin System')
    .setVersion('1.0')
    .addTag('Registration')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // UI will be at /api

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
