import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateCardRequest, CustomRequest, UpdateCardRequest } from '../models';
import { Card } from '.prisma/client';

export class CardController {
  constructor(private prisma: PrismaClient) {
  }

  async getAllGroupCards(req: Request, res: Response) {
    const cards = await this.prisma.card.findMany({
      where: {
        groupId: req.params.groupId
      },
      include: { word: true }
    })
    res.status(200).json(cards);
  }

  async createCard(req: CustomRequest<Card, CreateCardRequest>, res: Response<Card>) {
    let { wordId, symbols, transcrition, translation } = req.body;
    if (!wordId || !translation || !transcrition || !symbols) {
      res.status(422);
      return;
    }

    if (!wordId) {
      const word = await this.prisma.word.create({
        data: {
          translation,
          transcrition,
          symbols
        }
      })
      wordId = word.id;
    }

    this.prisma.card.create({
      data: {
        groupId: req.body.groupId,
        wordId,
      }
    })
    res.status(501);
  }

  async updateCard(req: CustomRequest<Card, UpdateCardRequest>, res: Response) {
    const card = await this.prisma.card.findFirst({ where: { id: req.params.cardId }, include: { word: true } })
    if (!card) {
      throw new Error(`Card with id=${req.params.cardId} not found`);
    }
    const wordCount = await this.prisma.card.count({ where: { wordId: card.wordId } })
    if (wordCount > 1) {
      let newWord = { ...card.word, ...req.body };
      newWord = await this.prisma.word.create({ data: { ...newWord, id: undefined } })
      await this.prisma.card.update({
        where: {
          id: card.id
        },
        data: {
          wordId: newWord.id
        }
      })
      res.status(200);
      return;
    }

    await this.prisma.word.update({
      where: { id: card.word.id }, data: {
        ...req.body
      }
    })
    res.status(200);
  }

  async deleteCard(req: Request, res: Response) {
    const card = await this.prisma.card.findFirst({ where: { id: req.params.cardId }, include: { word: true } });
    if (!card) {
      throw new Error(`Card with id=${req.params.cardId} not found`);
    }

    const wordCount = await this.prisma.card.count({ where: { wordId: card.wordId } })
    if (wordCount === 1) {
      await this.prisma.word.delete({ where: { id: card.word.id } })
    }

    await this.prisma.card.delete({ where: { id: card.id } })

    res.status(200);
  }
}
