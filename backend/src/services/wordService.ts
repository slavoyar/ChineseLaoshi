import { wordRepository } from '@repositories';

class WordService {
  search(query: string) {
    return wordRepository.searchWord(query);
  }
}

export const wordService = new WordService();
