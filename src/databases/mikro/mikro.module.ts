import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { defineConfig } from '@mikro-orm/postgresql';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        defineConfig({
          entities: ['./dist/modules/users/entities'],
          entitiesTs: ['./src/modules/users/entities'],
          dbName: configService.get('POSTGRES_DB'),
          user: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          driverOptions: {
            connection: {
              ssl: false, // Thay đổi nếu cần SSL
            },
          },
        }),
    }),
  ],
})
export class MikroModule {}
