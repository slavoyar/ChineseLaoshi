import { BaseService } from '@shared/api/base-service';
import { Card, CreateCard, GetWriteCard, UpdateCardStats, UpdateCardWord } from '@shared/api/generated';
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
