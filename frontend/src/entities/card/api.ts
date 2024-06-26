import BaseService from '@shared/api';
import { Card } from './model';

const URL = '/api/cards';

class CardService extends BaseService<Card> {}

const cardService = new CardService(URL);

export default cardService;
