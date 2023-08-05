import { BadRequestException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let userArr: User[];
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
    userArr = [];
    fakeUserService = {
      findOne: ({ email }) => {
        const user = userArr.find((user) => user.email === email);
        return Promise.resolve(user);
      },
      create: ({ email, hashPassword }) => {
        const user = {
          id: userArr.length,
          email,
          hashPassword,
        };
        userArr.push(user);
        return Promise.resolve(user);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: fakeUserService },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Create new user with hash password', async () => {
    const user = await service.signup({
      email: 'test@gmail.com',
      password: 'test',
    });
    expect(user).toBeDefined();
    expect(user.hashPassword).not.toEqual('test');
  });

  it('Should throw an error if sign up user already exists', async () => {
    await service.signup({
      email: 'test@gmail.com',
      password: 'test',
    });
    await expect(
      service.signup({
        email: 'test@gmail.com',
        password: 'test',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw error if signin user does not exist', async () => {
    await expect(
      service.signin({ email: 'test@gmail.com', password: 'test' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw error if signin user wrong password', async () => {
    await service.signup({
      email: 'test@gmail.com',
      password: 'test',
    });
    await expect(
      service.signin({ email: 'test@gmail.com', password: 'test2' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return user when sign in success', async () => {
    await service.signup({
      email: 'test@gmail.com',
      password: 'test',
    });
    const user = await service.signin({
      email: 'test@gmail.com',
      password: 'test',
    });
    expect(user).toBeDefined();
  });
});
