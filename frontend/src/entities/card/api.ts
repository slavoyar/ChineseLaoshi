import { BaseService } from '@shared/api';
import axios from 'axios';
import { Card } from './model';

const URL = '/api/cards';

class CardService extends BaseService<Card> {
  getCardsToStudy(id: string): Promise<Card[]> {
    return axios.get<Card[], Card[]>(`${this.url}/study/${id}`);
  }

  updateCardStats(id: string, guessed: boolean): Promise<Card> {
    return axios.patch<{ guessed: boolean }, Card>(`${this.url}/${id}`, { guessed });
  }
}

const cardService = new CardService(URL);

export default cardService;
