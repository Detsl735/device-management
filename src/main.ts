import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector)); // глобально применяем guard

  app.enableCors({
    origin: ['https://i8bljl-45-134-254-138.ru.tuna.am'],
    credentials: true,
    methods: 'GET,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  const config = new DocumentBuilder()
    .setTitle('Device API')
    .setDescription('Документация API устройств')
    .setVersion('1.0')
    .build();

  try {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  } catch (error) {
    console.error('Ошибка при создании Swagger документа:', error);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
