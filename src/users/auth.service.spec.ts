import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      find: (email: string) => {
        return Promise.resolve(users.filter((user) => user.email === email));
      },
      createUser: (name: string, email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999),
          name,
          email,
          password,
        } as User;
        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signup('asd@mail.com', 'ricardo', 'password');
    const [salt, hash] = user.password.split('.');

    expect(user.password).not.toEqual('1234');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throwns an error if email is in used', async () => {
    await service.signup('asd@mail.com', 'ricardo', '1234');

    try {
      await service.signup('asd@mail.com', 'ricardo', '1234');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('Email already in use.');
    }
  });

  it('throwns if signin is called with an unused email', async () => {
    try {
      await service.signin('asd@mail.com', '1234');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('User not found.');
    }
  });

  it('throwns if invalid password is provided', async () => {
    await service.signup('asd@mail.com', 'ricardo', 'password');

    try {
      await service.signin('asd@mail.com', 'fakepassword');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('Bad password');
    }
  });

  it('it return user if password is correct', async () => {
    await service.signup('asd@mail.com', 'ricardo', 'password');

    const user = await service.signin('asd@mail.com', 'password');

    expect(user).toBeDefined();
  });
});
