import {
  CardDto,
  CreateCardDto,
  GetWriteCardDto,
  UpdateCardStatsDto,
  UpdateCardWordDto,
} from '@chinese-laoshi/shared';
import { BaseService } from '@shared/api';
import axios from 'axios';

const URL = '/api/cards';

class CardService extends BaseService<CardDto, CreateCardDto, UpdateCardWordDto> {
  getCardsWritePractice(count: string, groupId?: string): Promise<CardDto[]> {
    return axios.post<GetWriteCardDto, CardDto[]>(
      `${this.url}/study/write`,
      { count, groupId },
      { cancelToken: this.getCancelToken('getCardsWritePractice') }
    );
  }

  updateCardStats(id: string, guessed: boolean): Promise<CardDto> {
    return axios.post<UpdateCardStatsDto, CardDto>(
      `${this.url}/stats`,
      { id, guessed },
      { cancelToken: this.getCancelToken('updateCardStats') }
    );
  }
}

const cardService = new CardService(URL);

export default cardService;
