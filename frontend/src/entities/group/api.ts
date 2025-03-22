import { GroupDto } from '@chinese-laoshi/shared';
import { BaseService } from '@shared/api';

const URL = '/api/groups';
class GroupService extends BaseService<GroupDto> {}

const groupService = new GroupService(URL);

export default groupService;
