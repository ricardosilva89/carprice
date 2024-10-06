import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, name: string, password: string) {
    const users = await this.userService.find(email);

    if (users.length) {
      throw new BadRequestException('Email already in use.');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = `${salt}.${hash.toString('hex')}`;

    return this.userService.createUser(name, email, result);
  }

  async signin(email: string, password: string) {
    const users = await this.userService.find(email);

    if (!users.length) {
      throw new NotFoundException('User not found.');
    }

    const [salt, storedHash] = users[0].password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password');
    }

    return users[0];
  }
}
