import request from 'supertest';

import app from '../src/app';

const agent = request.agent(app);

describe('Users', () => {
  describe('login', () => {
    it('login - should set cookie', async () => {
      const res = await agent.post('/api/auth/login').send({ username: 'slavoyar', password: 'slavoyar' });
      const setCookie = res.headers['set-cookie'] as unknown as string[];
      const accessToken = setCookie.find((c) => c.includes('accessToken'));
      const refreshToken = setCookie.find((c) => c.includes('refreshToken'));
      expect(accessToken).toContain('HttpOnly');
      expect(refreshToken).toContain('HttpOnly');
      expect(res.status).toBe(200);
    });

    it('login with username - should return 200', async () => {
      const res = await agent.post('/api/auth/login').send({ username: 'slavoyar', password: 'slavoyar' });
      expect(res.status).toBe(200);
    });

    it('login with email - should return 200', async () => {
      const res = await agent
        .post('/api/auth/login')
        .send({ username: 'slavoyar@mail.com', password: 'slavoyar' });
      expect(res.status).toBe(200);
    });

    it('login with wrong password - should return 401', async () => {
      const res = await agent.post('/api/auth/login').send({ username: 'slavoyar', password: 'wrong' });
      expect(res.status).toBe(401);
    });

    it('login with wrong username - should return 401', async () => {
      const res = await agent.post('/api/auth/login').send({ username: 'wrong', password: 'slavoyar' });
      expect(res.status).toBe(401);
    });
  });
  describe('register', () => {
    it('register - should set cookie', async () => {
      const res = await agent
        .post('/api/auth/register')
        .send({ username: 'username', email: 'username@mail.com', password: 'username' });
      const setCookie = res.headers['set-cookie'] as unknown as string[];
      const accessToken = setCookie.find((c) => c.includes('accessToken'));
      const refreshToken = setCookie.find((c) => c.includes('refreshToken'));
      expect(accessToken).toContain('HttpOnly');
      expect(refreshToken).toContain('HttpOnly');
      expect(res.status).toBe(200);
    });

    it('register with wrong email - should return 400', async () => {
      const res = await agent
        .post('/api/auth/register')
        .send({ username: 'username', email: 'username', password: 'username' });
      expect(res.status).toBe(400);
    });

    it('register with wrong password - should return 400', async () => {
      const res = await agent
        .post('/api/auth/register')
        .send({ username: 'username', email: 'username@mail.com', password: 'wrong' });
      expect(res.status).toBe(400);
    });

    it('register with wrong username - should return 400', async () => {
      const res = await agent
        .post('/api/auth/register')
        .send({ username: '', email: 'username@mail.com', password: 'username' });
      expect(res.status).toBe(400);
    });
  });

  it('logout - should reset cookies', async () => {
    const res = await agent.post('/api/auth/logout');
    const setCookie = res.headers['set-cookie'] as unknown as string[];
    const accessToken = setCookie.find((c) => c.includes('accessToken'))?.split(';')[0];
    const refreshToken = setCookie.find((c) => c.includes('refreshToken'))?.split(';')[0];
    expect(accessToken).toEqual('accessToken=');
    expect(refreshToken).toEqual('refreshToken=');
  });

  describe('refresh', () => {
    it('refresh - should return 200', async () => {
      await agent.post('/api/auth/login').send({ username: 'slavoyar', password: 'slavoyar' });
      const res = await agent.post('/api/auth/refresh-token');
      expect(res.status).toBe(200);
    });

    it('refresh - should return 401', async () => {
      await agent.post('/api/auth/logout');
      const res = await agent.post('/api/auth/refresh-token');
      expect(res.status).toBe(401);
    });
  });
});
