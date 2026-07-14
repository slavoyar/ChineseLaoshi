import { CardDto, GroupDto } from '@chinese-laoshi/shared';

const GROUP_NUMBERS_ID = '11111111-1111-4111-8111-111111111101';
const GROUP_PRONOUNS_ID = '22222222-2222-4222-8222-222222222202';
const GROUP_GREETINGS_ID = '33333333-3333-4333-8333-333333333303';

export const MOCK_GROUPS: GroupDto[] = [
  { id: GROUP_NUMBERS_ID, name: 'Numbers', wordCount: 5 },
  { id: GROUP_PRONOUNS_ID, name: 'Pronouns', wordCount: 4 },
  { id: GROUP_GREETINGS_ID, name: 'Greetings', wordCount: 3 },
];

const card = (
  id: string,
  groupId: string,
  symbols: string,
  transcription: string,
  translation: string,
  progress: number
): CardDto => ({
  id,
  groupId,
  progress,
  showCount: Math.floor(progress * 10),
  step: Math.floor(progress * 5),
  isWinStreak: progress > 0.5,
  streak: progress > 0.5 ? 2 : 0,
  word: {
    id: `word-${id}`,
    symbols,
    transcription,
    translation,
  },
});

export const MOCK_CARDS: CardDto[] = [
  card('card-01', GROUP_NUMBERS_ID, '一', 'yī', 'one', 0),
  card('card-02', GROUP_NUMBERS_ID, '二', 'èr', 'two', 0.25),
  card('card-03', GROUP_NUMBERS_ID, '三', 'sān', 'three', 0.5),
  card('card-04', GROUP_NUMBERS_ID, '四', 'sì', 'four', 0.75),
  card('card-05', GROUP_NUMBERS_ID, '五', 'wǔ', 'five', 1),
  card('card-06', GROUP_PRONOUNS_ID, '我', 'wǒ', 'I', 0.1),
  card('card-07', GROUP_PRONOUNS_ID, '你', 'nǐ', 'you', 0.4),
  card('card-08', GROUP_PRONOUNS_ID, '他', 'tā', 'he', 0.6),
  card('card-09', GROUP_PRONOUNS_ID, '她', 'tā', 'she', 0.85),
  card('card-10', GROUP_GREETINGS_ID, '你好', 'nǐ hǎo', 'hello', 0),
  card('card-11', GROUP_GREETINGS_ID, '谢谢', 'xièxie', 'thank you', 0.3),
  card('card-12', GROUP_GREETINGS_ID, '再见', 'zàijiàn', 'goodbye', 0.55),
];
