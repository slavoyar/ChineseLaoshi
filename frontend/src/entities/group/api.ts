import { BaseService } from '@shared/api/base-service';
import { Group } from '@shared/api/generated';

const URL = '/api/groups';
class GroupService extends BaseService<Group> {}

const groupService = new GroupService(URL);

export default groupService;
