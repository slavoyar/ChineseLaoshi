import { Request, Response } from 'express';

export const getAllGroupCards = (req: Request, res: Response): void => {
  res.status(501);
}

export const createCard = (req: Request, res: Response): void => {
  res.status(501);
}

export const updateCard = (req: Request, res: Response): void => {
  // edit card info and word. create new word if it is used in other cards
  res.status(501);
}
export const deleteCard = (req: Request, res: Response): void => {
  // delete card and connected word if it is connected only for that card
  res.status(501);
}
