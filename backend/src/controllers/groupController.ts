import { CustomError } from '@configs/errors';
import { CreateGroupDto, GroupDto, UpdateGroupDto } from '@dtos';
import { groupService } from '@services';
import { NextFunction, Request, Response } from 'express';

export const getAllGroups = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;
  if (!user) {
    return next(new CustomError('notAuth'));
  }
  const groups = await groupService.getGroupsByUserId(user.id);
  res.json(groups);
};

export const createGroup = async (
  req: Request<Record<string, string>, GroupDto, CreateGroupDto>,
  res: Response,
  next: NextFunction,
) => {
  const { user } = req;
  if (!user) {
    return next(new CustomError('notAuth'));
  }

  const group = await groupService.createGroup({ userId: user.id, name: req.body.name });
  res.json(group);
};

export const updateGroup = async (
  req: Request<Record<string, string>, GroupDto, UpdateGroupDto>,
  res: Response,
) => {
  const group = await groupService.updateGroup(req.body);
  res.json(group);
};

export const deleteGroup = async (req: Request<{ groupId: string }>, res: Response) => {
  await groupService.deleteGroup(req.params.groupId);
  res.json(true);
};
