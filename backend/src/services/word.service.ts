import { wordRepository } from '@repositories';
import type { WordDto } from '@shared/types';

class WordService {
  search(query: string): Promise<WordDto[]> {
    return wordRepository.searchWord(query);
  }
}

export const wordService = new WordService();
