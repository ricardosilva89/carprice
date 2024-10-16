import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const emailRef = 'ricardo32@mail.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: emailRef, name: 'ricardo', password: '1234' })
      .expect(201)
      .then((response) => {
        const { id, email, name } = response.body;
        expect(id).toBeDefined();
        expect(name).toBeDefined();
        expect(email).toEqual(emailRef);
      });
  });

  it('signup and then get the current user ', async () => {
    const emailRef = 'ricardo32@mail.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: emailRef, name: 'ricardo', password: '1234' })
      .expect(201);
    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(emailRef);
  });
});
