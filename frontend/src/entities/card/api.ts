import { BaseService } from '@shared/api';
import { Card, CreateCard, GetWriteCard, UpdateCardStats, UpdateCardWord } from '@shared/api/generated';
import axios from 'axios';

const URL = '/api/cards';

class CardService extends BaseService<Card, CreateCard, UpdateCardWord> {
  getCardsWritePractice(count: string, groupId?: string): Promise<Card[]> {
    return axios.post<GetWriteCard, Card[]>(
      `${this.url}/study/write`,
      { count, groupId },
      { cancelToken: this.getCancelToken('getCardsWritePractice') }
    );
  }

  updateCardStats(id: string, guessed: boolean): Promise<void> {
    return axios.post<UpdateCardStats, void>(
      `${this.url}/stats`,
      { id, guessed },
      { cancelToken: this.getCancelToken('updateCardStats') }
    );
  }
}

const cardService = new CardService(URL);

export default cardService;
