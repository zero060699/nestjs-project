import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthKeycloakModule } from 'src/commons/auth-keycloak/auth-keycloak.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
// import { RolesKeycloakModule } from 'src/commons/roles-keycloak/roles-keycloak.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    AuthKeycloakModule,
    // RolesKeycloakModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
