import BaseService from '@shared/api';
import { Group } from './model/types';

const URL = '/api/groups';
class GroupService extends BaseService<Group> {}

const groupService = new GroupService(URL);

export default groupService;
