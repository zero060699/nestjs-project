import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private em: EntityManager) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      const user = new User();
      user.username = createUserDto.username;
      user.password = await bcrypt.hash(createUserDto.password, salt);
      user.email = createUserDto.email;
      const { username, email } = createUserDto;
      const existingUserByUsername = await this.em.findOne(User, { username });
      if (existingUserByUsername) {
        throw new ConflictException('Username already exists');
      }
      const existingUserByEmail = await this.em.findOne(User, { email });
      if (existingUserByEmail) {
        throw new ConflictException('Email already exists');
      }
      await this.em.persistAndFlush(user);
      return user;
    } catch (error) {
      throw new BadRequestException('Create user failed');
    }
  }

  async findAll(): Promise<User[]> {
    return await this.em.find(User, {});
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.em.findOne(User, { username });
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.em.findOne(User, { id });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      const user = await this.em.findOneOrFail(User, { id });
      if (!user) {
        throw new NotFoundException('user not found');
      }
      const { username, email } = updateUserDto;
      const existingUserByUsername = await this.em.findOne(User, { username });
      if (existingUserByUsername) {
        throw new ConflictException('Username already exists');
      }
      const existingUserByEmail = await this.em.findOne(User, { email });
      if (existingUserByEmail) {
        throw new ConflictException('Email already exists');
      }
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
      await this.em.assign(user, updateUserDto);
      await this.em.persistAndFlush(user);
      return user;
    } catch (error) {
      throw new BadRequestException('Update user failed');
    }
  }

  async remove(id: number): Promise<void> {
    const user = await this.em.findOne(User, { id });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    await this.em.removeAndFlush(user);
  }

  async removeall(): Promise<void> {
    await this.em.nativeDelete(User, {});
  }
}
