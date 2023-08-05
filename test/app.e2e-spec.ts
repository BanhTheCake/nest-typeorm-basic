import { Test, TestingModule } from '@nestjs/testing';
import { type INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(
      cookieSession({
        keys: ['banhTheSercet'],
      }),
    );
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    dataSource = app.get(DataSource);
    await app.init();
  });

  afterEach(async () => {
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      await dataSource
        .getRepository(entity.name)
        .createQueryBuilder()
        .delete()
        .execute();
    }
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Signup POST /auth/signup', () => {
    const createUserDto = {
      email: 'test@gmail.com',
      password: 'test',
    };

    it('Should return 201 when signup successful', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(createUserDto);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual({
        id: expect.any(Number),
        email: createUserDto.email,
      });
    });

    it('Should thrown error when send wrong format email', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          ...createUserDto,
          email: 'test',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({
        statusCode: expect.any(Number),
        message: ['email must be an email'],
        error: 'Bad Request',
      });
    });

    it('Should thrown BadRequestException when user has been exist', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(createUserDto);
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(createUserDto);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({
        statusCode: expect.any(Number),
        message: 'User has been exist.',
        error: 'Bad Request',
      });
    });
  });

  describe('Signin Post /auth/signin', () => {
    const signinDto = {
      email: 'test@gmail.com',
      password: 'test',
    };

    beforeEach(async () => {
      await request(app.getHttpServer()).post('/auth/signup').send(signinDto);
    });

    it('Should return user when signin successful', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(signinDto);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual({
        id: expect.any(Number),
        email: signinDto.email,
      });
    });

    it('Should thrown BadRequestException when email or password is incorrect', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          ...signinDto,
          password: 'test2',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({
        statusCode: expect.any(Number),
        message: 'email or password is incorrect.',
        error: 'Bad Request',
      });
    });
  });

  describe('Whoami GET /auth/whoami', () => {
    const accountTest = {
      email: 'banh@gmail.com',
      password: 'test',
    };
    let sessionHeader;
    beforeEach(async () => {
      await request(app.getHttpServer()).post('/auth/signup').send(accountTest);
      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(accountTest);
      sessionHeader = res.headers['set-cookie'];
    });
    it('Should allow to access whoami', async () => {
      console.log(sessionHeader);
      const res = await request(app.getHttpServer())
        .get('/auth/whoami')
        .set('Cookie', [...sessionHeader]);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        id: expect.any(Number),
        email: accountTest.email,
      });
    });
  });
});
