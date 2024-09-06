// import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
// import { Exclude } from 'class-transformer';
import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class User {
  @PrimaryKey()
  id: number;

  @Property()
  username: string;

  @Property({ hidden: true })
  password: string;

  @Property()
  email: string;
}
