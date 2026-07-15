import { Group } from '@shared/api/generated';
import { BaseService } from '@shared/api';

const URL = '/api/groups';
class GroupService extends BaseService<Group> {}

const groupService = new GroupService(URL);

export default groupService;
