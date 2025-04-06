import request from 'supertest';

import app from '../src/app';

const agent = request.agent(app);

describe('Words', () => {
  it('search word with empty query - should return empty array', async () => {
    const res = await agent.get('/api/words');
    expect(res.body.length).toBe(0);
    expect(res.status).toBe(200);
  });

  it('search word with existing query - should return words', async () => {
    const res = await agent.get('/api/words?search=y');
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.status).toBe(200);
  });

  it('search word with not existing query - should return empty array', async () => {
    const res = await agent.get('/api/words?search=wrong');
    expect(res.body.length).toBe(0);
    expect(res.status).toBe(200);
  });
});
