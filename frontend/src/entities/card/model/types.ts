export interface Word {
  id: string;
  transcription: string;
  translation: string;
  symbols: string;
}

export interface Card {
  id: string;
  groupId: string;
  writeRatio: number;
  word: Word;
}
