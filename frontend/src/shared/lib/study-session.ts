import { Card } from '@shared/api';
import { MIXED_FACES, MixedFace, StudyMode } from '@shared/config';

export const STUDY_SESSION_KEY = 'cl_study_session';

export interface StudySessionSnapshot {
  mode: StudyMode;
  groupId?: string;
  count: string;
  cards: Card[];
  currentIndex: number;
  cardFaces?: Record<string, MixedFace>;
}

export const randomMixedFace = (): MixedFace =>
  MIXED_FACES[Math.floor(Math.random() * MIXED_FACES.length)];

export const assignMixedFaces = (cards: { id: string }[]): Record<string, MixedFace> =>
  Object.fromEntries(cards.map((card) => [card.id, randomMixedFace()]));

export const saveStudySession = (snapshot: StudySessionSnapshot): void => {
  try {
    sessionStorage.setItem(STUDY_SESSION_KEY, JSON.stringify(snapshot));
  } catch {
    // sessionStorage may be unavailable
  }
};

export const loadStudySession = (): StudySessionSnapshot | null => {
  try {
    const raw = sessionStorage.getItem(STUDY_SESSION_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as StudySessionSnapshot;
  } catch {
    return null;
  }
};

export const clearStudySession = (): void => {
  try {
    sessionStorage.removeItem(STUDY_SESSION_KEY);
  } catch {
    // ignore
  }
};
