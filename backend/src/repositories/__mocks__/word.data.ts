import { Word } from '@prisma/client';
import { getUuid } from '@utils';

export const words: Word[] = [
  {
    id: getUuid(1),
    symbols: '一',
    transcription: 'yi',
    translation: 'один',
  },
  {
    id: getUuid(2),
    symbols: '二',
    transcription: 'er',
    translation: 'два',
  },
  {
    id: getUuid(3),
    symbols: '狗',
    transcription: 'gou',
    translation: 'собака',
  },
];
