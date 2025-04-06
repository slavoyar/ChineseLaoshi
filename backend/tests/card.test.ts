import { words } from '@repositories/__mocks__/word.data';
import { getUuid } from '@utils';
import request from 'supertest';

import app from '../src/app';

const agent = request.agent(app);

describe('Card not auth', () => {
  it('get cards - should return 401', async () => {
    const groupId = getUuid(1);
    const res = await agent.get(`/api/cards/${groupId}`);
    expect(res.status).toBe(401);
  });

  it('get write cards - should return 401', async () => {
    const res = await agent.post('/api/cards/study/write').send({ groupId: getUuid(1), count: '1' });
    expect(res.status).toBe(401);
  });

  it('create card - should return 401', async () => {
    const res = await agent.post('/api/cards').send({ groupId: getUuid(1), word: { id: getUuid(1) } });
    expect(res.status).toBe(401);
  });

  it('update card - should return 401', async () => {
    const res = await agent.put('/api/cards').send({ id: getUuid(1), word: words[0] });
    expect(res.status).toBe(401);
  });

  it('update card stats - should return 401', async () => {
    const res = await agent.post('/api/cards/stats').send({ id: getUuid(1), guessed: true });
    expect(res.status).toBe(401);
  });

  it('delete card - should return 401', async () => {
    const id = getUuid(1);
    const res = await agent.delete(`/api/cards/${id}`);
    expect(res.status).toBe(401);
  });
});
