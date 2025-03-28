import { authMiddleware } from '@middlewares';
import { groupService } from '@services';
import type { CreateGroupDto, UpdateGroupDto } from '@shared/types';

import { createRouter, Ok, type Params } from './createRouter';

const { router, createRoute } = createRouter('/groups');

createRoute(
  async (req) => {
    const { user } = req;
    const groups = await groupService.getGroupsByUserId(user.id);
    return Ok(groups);
  },
  {
    middlewares: [authMiddleware],
  }
);

createRoute<Params, CreateGroupDto>(
  async (req) => {
    const { user } = req;
    const group = await groupService.createGroup(req.body, user.id);
    return Ok(group);
  },
  {
    method: 'post',
    middlewares: [authMiddleware],
  }
);

createRoute<Params, UpdateGroupDto>(
  async (req) => {
    const group = await groupService.updateGroup(req.body);
    return Ok(group);
  },
  {
    method: 'put',
  }
);

createRoute<{ groupId: string }>(
  async (req) => {
    await groupService.deleteGroup(req.params.groupId);
    return Ok();
  },
  {
    method: 'delete',
    endpoint: '/:groupId',
  }
);

export default router;
