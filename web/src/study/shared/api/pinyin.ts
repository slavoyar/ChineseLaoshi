import axios, { type CancelTokenSource } from 'axios';

import { apiRequest } from './api-error';
import type { PinyinRequest, PinyinResponse } from './generated';

const URL = '/api/pinyin';

let cancelSource: CancelTokenSource | null = null;

export const fetchPinyin = (text: string): Promise<PinyinResponse> => {
  if (cancelSource) {
    cancelSource.cancel();
  }
  cancelSource = axios.CancelToken.source();

  return apiRequest(
    axios.post<PinyinRequest, PinyinResponse>(URL, { text }, { cancelToken: cancelSource.token }),
    { notify: false }
  );
};
