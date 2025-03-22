import { CustomError } from '@configs/errors';
import { groupService } from '@services';
import type { CreateGroupDto, GroupDto, Id, UpdateGroupDto } from '@shared/types';
import type { NextFunction, Request, Response } from 'express';
import typia from 'typia';

type CreateGroupRequest = Request<void, GroupDto, CreateGroupDto>;
type UpdateGroupRequest = Request<{ groupId: Id }, GroupDto, UpdateGroupDto>;
type DeleteGroupRequest = Request<{ groupId: Id }>;

export const getAllGroups = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;
  if (!user) {
    return next(new CustomError('notAuth'));
  }
  const groups = await groupService.getGroupsByUserId(user.id);
  res.json(groups);
};

export const createGroup = async (req: CreateGroupRequest, res: Response, next: NextFunction) => {
  const { user } = req;
  if (!user) {
    return next(new CustomError('notAuth'));
  }

  if (typia.is<CreateGroupDto>(req.body) === false) {
    return next(new CustomError('validationError'));
  }

  const group = await groupService.createGroup(req.body, user.id);
  res.json(group);
};

export const updateGroup = async (req: UpdateGroupRequest, res: Response, next: NextFunction) => {
  if (typia.is<UpdateGroupDto>(req.body) === false) {
    return next(new CustomError('validationError'));
  }
  const group = await groupService.updateGroup(req.body);
  res.json(group);
};

export const deleteGroup = async (req: DeleteGroupRequest, res: Response) => {
  await groupService.deleteGroup(req.params.groupId);
  res.json(true);
};
