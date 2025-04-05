import { groups } from '@repositories/__mocks__/group.data';
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

  it('get groups - should return 200 and groups', async () => {
    const res = await agent.get('/api/groups');
    expect(res.status).toBe(200);
    expect(res.body.length).toEqual(groups.filter((g) => g.userId === getUuid(1)).length);
  });

  it('create group - should return 200', async () => {
    const res = await agent.post('/api/groups').send({ name: 'test' });
    expect(res.status).toBe(200);
    expect(res.body.name).toEqual('test');
  });

  it('create group with empty name - should return 400', async () => {
    const res = await agent.post('/api/groups').send({ name: '' });
    expect(res.status).toBe(400);
  });

  it('create group with empty body - should return 400', async () => {
    const res = await agent.post('/api/groups').send({});
    expect(res.status).toBe(400);
  });

  it('update group - should return 200', async () => {
    const res = await agent.put('/api/groups').send({ id: getUuid(1), name: 'new name' });
    expect(res.status).toBe(200);
    expect(res.body.name).toEqual('new name');
  });

  it('update group with empty name - should return 400', async () => {
    const res = await agent.put('/api/groups').send({ id: getUuid(1), name: '' });
    expect(res.status).toBe(400);
  });

  it('update group with empty body - should return 400', async () => {
    const res = await agent.put('/api/groups').send({});
    expect(res.status).toBe(400);
  });

  it('delete group - should return 200', async () => {
    const id = getUuid(1);
    const res = await agent.delete(`/api/groups/${id}`);
    expect(res.status).toBe(200);
  });

  it('delete group - should return 404', async () => {
    const id = getUuid(404);
    const res = await agent.delete(`/api/groups/${id}`);
    expect(res.status).toBe(404);
  });
});
