import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './databases/databases.module';
import { MikroModule } from './databases/mikro/mikro.module';
import { AuthModule } from './modules/auth-jwt/auth-jwt.module';
import { AuthKeycloakModule } from './commons/auth-keycloak/auth-keycloak.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    MikroModule,
    // DatabaseModule,
    AuthModule,
    AuthKeycloakModule,
    // RolesKeycloakModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
