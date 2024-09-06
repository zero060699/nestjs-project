import { Module } from '@nestjs/common';
import { AuthKeycloakService } from './auth-keycloak.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthKeycloakController } from './auth-keycloak.controller';
import { JwtKeyAuthGuard } from './jwt-auth.guard';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [PassportModule, JwtModule, MikroOrmModule.forFeature([User])],
  providers: [AuthKeycloakService, JwtKeyAuthGuard],
  exports: [AuthKeycloakService, JwtKeyAuthGuard],
  controllers: [AuthKeycloakController],
})
export class AuthKeycloakModule {}
