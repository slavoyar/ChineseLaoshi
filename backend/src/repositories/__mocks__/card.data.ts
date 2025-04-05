import { Card } from '@prisma/client';
import { getUuid } from '@utils';

export const cards: Card[] = [
  {
    id: getUuid(1),
    groupId: getUuid(1),
    wordId: getUuid(1),
    showCount: 0,
    progress: 0,
    step: 0,
    isWinStreak: false,
    streak: 0,
    updatedAt: new Date(),
  },
  {
    id: getUuid(2),
    groupId: getUuid(1),
    wordId: getUuid(2),
    showCount: 0,
    progress: 0,
    step: 0,
    isWinStreak: false,
    streak: 0,
    updatedAt: new Date(),
  },
  {
    id: getUuid(3),
    groupId: getUuid(2),
    wordId: getUuid(3),
    showCount: 0,
    progress: 0,
    step: 0,
    isWinStreak: false,
    streak: 0,
    updatedAt: new Date(),
  },
];
