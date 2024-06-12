import { Group } from '@prisma/client';
import { Request, Response } from 'express';

import { getPrisma } from '../configs/prisma/prismaInjection';
import { CustomRequest } from '../models';

const prisma = getPrisma();
export const getAllGroups = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authorised', code: 'notAuth' });
    return;
  }
  const groups = await prisma.group.findMany({
    where: { userId: req.user.id },
  });
  res.json(groups);
};

export const createGroup = async (req: CustomRequest<Group, { name: string }>, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authorised', code: 'notAuth' });
    return;
  }
  const group = await prisma.group.create({
    data: { name: req.body.name, userId: req.user.id },
  });
  res.status(200).json(group);
};
export const updateGroup = async (req: CustomRequest<Group, Group>, res: Response) => {
  const group = await prisma.group.update({
    where: { id: req.body.id },
    data: { name: req.body.name },
  });
  res.status(200).json(group);
};
export const deleteGroup = async (req: Request, res: Response) => {
  await prisma.group.delete({ where: { id: req.params.groupId } });
  res.status(200);
};
