export interface Word {
  id: string;
  transcription: string;
  translation: string;
  symbols: string;
}

export interface Card {
  id: string;
  guessRatio: number;
  word: Word;
}
