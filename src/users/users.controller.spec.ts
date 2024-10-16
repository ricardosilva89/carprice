import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne(id) {
        return Promise.resolve({
          id,
          email: '',
          name: '',
          password: '',
        } as User);
      },
      find(email) {
        return Promise.resolve([
          { id: 1, email, name: '', password: '' } as User,
        ]);
      },
    };

    fakeAuthService = {
      signin(email, password) {
        return Promise.resolve({
          id: 1,
          email,
          name: '',
          password,
        } as User);
      },
      signup(email, name, password) {
        return Promise.resolve({
          id: 1,
          email,
          name,
          password,
        } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('find all users, return a list of users with the given email', async () => {
    const users = await controller.findAllUser('test@email.com');
    expect(users.length).toEqual(1);
  });
  it('findUser return a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });
  it('findUser throws an error if user iwht given id is not found', async () => {
    fakeUsersService.findOne = () => null;

    try {
      await controller.findUser('1');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('User not found');
    }
  });
  it('signin uopdated session object ans returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      {
        email: 'mail@mail.com',
        password: 'password',
      },
      session,
    );

    expect(user.id).toBe(1);
    expect(session.userId).toBe(1);
  });
});
