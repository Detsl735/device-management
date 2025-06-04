import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Device API')
    .setDescription('Документация API устройств')
    .setVersion('1.0')
    .build();

  try {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  } catch (error) {
    console.error('🔥 Ошибка при создании Swagger документа:', error);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
