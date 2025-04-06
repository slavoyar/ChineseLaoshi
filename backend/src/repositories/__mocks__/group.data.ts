import { Group } from '@prisma/client';
import { getUuid } from '@utils';

import { cards } from './card.data';

const userId = getUuid(1);
export const groups: Group[] = [
  {
    id: getUuid(1),
    name: 'Numbers',
    wordCount: cards.filter((c) => c.groupId === getUuid(1)).length,
    userId,
  },
  {
    id: getUuid(2),
    name: 'Colors',
    wordCount: cards.filter((c) => c.groupId === getUuid(2)).length,
    userId,
  },
  {
    id: getUuid(3),
    name: 'Animals',
    wordCount: cards.filter((c) => c.groupId === getUuid(3)).length,
    userId,
  },
];
