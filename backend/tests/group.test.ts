import { getUuid } from '@utils';
import request from 'supertest';

import app from '../src/app';

const agent = request.agent(app);

describe('Groups not auth', () => {
  it('get groups - should return 401', async () => {
    const res = await agent.get('/api/groups');
    expect(res.status).toBe(401);
  });

  it('create group - should return 401', async () => {
    const res = await agent.post('/api/groups').send({ name: 'test' });
    expect(res.status).toBe(401);
  });

  it('update group - should return 401', async () => {
    const res = await agent.put('/api/groups').send({ id: getUuid(1), name: 'new name' });
    expect(res.status).toBe(401);
  });

  it('delete group - should return 401', async () => {
    const id = getUuid(1);
    const res = await agent.delete(`/api/groups/${id}`);
    expect(res.status).toBe(401);
  });
});

describe('Groups auth', () => {
  beforeAll(async () => {
    await agent.post('/api/auth/login').send({ username: 'slavoyar', password: 'slavoyar' });
  });

  it('get groups - should return 200', async () => {
    const res = await agent.get('/api/groups');
    expect(res.status).toBe(200);
  });
});
