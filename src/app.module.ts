import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeviceModule } from './device/device.module';
import { EmployeeModule } from './employee/employee.module';
import { DevicelogModule } from './devicelog/devicelog.module';
import { ModelModule } from './model/model.module';
import { TypeModule } from './type/type.module';
import { FeatureModule } from './feature/feature.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
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
    DeviceModule,
    EmployeeModule,
    DevicelogModule,
    ModelModule,
    TypeModule,
    FeatureModule,
    ProfileModule,
  ],
})
export class AppModule {}
