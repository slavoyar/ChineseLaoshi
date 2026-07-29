// FSD prefers CRUD in shared/api; kept here next to the Zustand entity store.
// Revisit if a third consumer appears outside this slice.
import { BaseService, Group } from '@shared/api';

const URL = '/api/groups';
class GroupService extends BaseService<Group> {}

const groupService = new GroupService(URL);

export default groupService;
