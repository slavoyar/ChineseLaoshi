// FSD prefers CRUD in shared/api; kept here next to the Zustand entity store.
// Revisit if a third consumer appears outside this slice.
import {
  BaseService,
  Card,
  CreateCard,
  GetWriteCard,
  UpdateCardStats,
  UpdateCardWord,
  Word,
} from '@shared/api';
import axios from 'axios';

const URL = '/api/cards';

class CardService extends BaseService<Card, CreateCard, UpdateCardWord> {
  getCardsWritePractice(count: string, groupId?: string): Promise<Card[]> {
    return this.request(
      axios.post<GetWriteCard, Card[]>(
        `${this.url}/study/write`,
        { count, groupId },
        { cancelToken: this.getCancelToken('getCardsWritePractice') }
      ),
      { notify: true }
    );
  }

  getQuizDistractors(cardId: string): Promise<Word[]> {
    return this.request(
      axios.get<Word[]>(`${this.url}/distractors`, {
        params: { cardId },
        cancelToken: this.getCancelToken(`getQuizDistractors:${cardId}`),
      }),
      { notify: false }
    );
  }

  updateCardStats(id: string, guessed: boolean): Promise<void> {
    return this.request(
      axios.post<UpdateCardStats, void>(
        `${this.url}/stats`,
        { id, guessed },
        { cancelToken: this.getCancelToken('updateCardStats') }
      ),
      { notify: true }
    );
  }
}

const cardService = new CardService(URL);

export default cardService;
