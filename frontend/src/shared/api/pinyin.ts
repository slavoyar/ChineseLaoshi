import { apiRequest } from './api-error';
import type { PinyinRequest, PinyinResponse } from './generated';
import axios, { type CancelTokenSource } from 'axios';

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
