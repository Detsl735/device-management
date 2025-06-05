import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeviceModule } from './device/device.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { EmployeeModule } from './employee/employee.module';
import { DevicelogModule } from './devicelog/devicelog.module';
import { ModelModule } from './model/model.module';
import { TypeModule } from './type/type.module';
import { FeatureModule } from './feature/feature.module';
import { ProfileModule } from './profile/profile.module';
import { StatusModule } from './status/status.module';
import { AuthModule } from './auth/auth.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('BOT_TOKEN'),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DeviceModule,
    EmployeeModule,
    DevicelogModule,
    ModelModule,
    TypeModule,
    FeatureModule,
    ProfileModule,
    StatusModule,
    AuthModule,
    TelegramModule,
  ],
})
export class AppModule {}
