import { CardDto } from '@chinese-laoshi/shared';
import { BaseService } from '@shared/api';
import axios from 'axios';

const URL = '/api/cards';

class CardService extends BaseService<CardDto> {
  getCardsWritePractice(count: string, groupId?: string): Promise<CardDto[]> {
    const group = groupId ? `&groupId=${groupId}` : '';
    return axios.get<CardDto[], CardDto[]>(`${this.url}/study/write?count=${count}${group}`);
  }

  updateCardStats(id: string, guessed: boolean): Promise<CardDto> {
    return axios.post<{ id: string; guessed: boolean }, CardDto>(this.url, { id, guessed });
  }
}

const cardService = new CardService(URL);

export default cardService;
