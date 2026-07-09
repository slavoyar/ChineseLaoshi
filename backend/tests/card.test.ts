import { wordRepository } from '@repositories';
import { cards } from '@repositories/__mocks__/card.data';
import { words } from '@repositories/__mocks__/word.data';
import { getUuid } from '@utils';
import request from 'supertest';

import app from '../src/app';

const agent = request.agent(app);

describe('Cards', () => {
  it('get cards - should return 200 and cards', async () => {
    const groupId = getUuid(1);
    const res = await agent.get(`/api/cards/${groupId}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toEqual(cards.filter((w) => w.groupId === groupId).length);
  });

  describe('create card', () => {
    it('create card with new word - should return 200', async () => {
      const word = { ...words[0], id: undefined };
      const res = await agent.post('/api/cards').send({ groupId: getUuid(1), word });
      expect(res.status).toBe(200);
    });

    it('create card with existing word - should return 200', async () => {
      const res = await agent.post('/api/cards').send({ groupId: getUuid(1), word: { id: getUuid(1) } });
      expect(res.status).toBe(200);
    });

    it('create card with empty body - should return 400', async () => {
      const res = await agent.post('/api/cards').send({});
      expect(res.status).toBe(400);
    });

    it('create card with word id and body - should create new word', async () => {
      const createWordSpy = jest.spyOn(wordRepository, 'createWord');
      createWordSpy.mockClear();
      const res = await agent.post('/api/cards').send({ groupId: getUuid(1), word: words[0] });
      expect(createWordSpy).toHaveBeenCalledTimes(1);
      expect(res.status).toBe(200);
    });
  });

  describe('update card', () => {
    it('update card - should return 200', async () => {
      const res = await agent.put('/api/cards').send({ id: getUuid(1), word: words[0] });
      expect(res.status).toBe(200);
    });

    it('update card with empty body - should return 400', async () => {
      const res = await agent.put('/api/cards').send({});
      expect(res.status).toBe(400);
    });

    it('update card without word id - should return 400', async () => {
      const word = { ...words[0], id: undefined };
      const res = await agent.put('/api/cards').send({ word, id: getUuid(1) });
      expect(res.status).toBe(400);
    });
  });

  describe('update card stats', () => {
    it('update card stats with guessed - should return 200', async () => {
      const res = await agent.post('/api/cards/stats').send({ id: getUuid(1), guessed: true });
      expect(res.status).toBe(200);
    });

    it('update card stats with not guessed - should return 200', async () => {
      const res = await agent.post('/api/cards/stats').send({ id: getUuid(1), guessed: false });
      expect(res.status).toBe(200);
    });

    it('update card stats with empty body - should return 400', async () => {
      const res = await agent.post('/api/cards/stats').send({});
      expect(res.status).toBe(400);
    });

    it('update card stats without id - should return 400', async () => {
      const res = await agent.post('/api/cards/stats').send({ guessed: true });
      expect(res.status).toBe(400);
    });

    it('update card stats without guessed - should return 400', async () => {
      const res = await agent.post('/api/cards/stats').send({ id: getUuid(1) });
      expect(res.status).toBe(400);
    });
  });

  describe('delete card', () => {
    it('delete card - should return 200', async () => {
      const id = getUuid(1);
      const res = await agent.delete(`/api/cards/${id}`);
      expect(res.status).toBe(200);
    });

    it('delete card - should return 404', async () => {
      const id = getUuid(404);
      const res = await agent.delete(`/api/cards/${id}`);
      expect(res.status).toBe(404);
    });
  });
});
