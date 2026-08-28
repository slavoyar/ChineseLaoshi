import { MIXED_FACES, MixedFace } from '@shared/config';

export const randomMixedFace = (): MixedFace =>
  MIXED_FACES[Math.floor(Math.random() * MIXED_FACES.length)];

export const assignMixedFaces = (cards: { id: string }[]): Record<string, MixedFace> =>
  Object.fromEntries(cards.map((card) => [card.id, randomMixedFace()]));

export const MIXED_SESSION_KEY = 'cl_mixed_session';

export interface MixedSessionSnapshot {
  mode: 'mixed';
  groupId?: string;
  count: string;
  cardIds: string[];
  cardFaces: Record<string, MixedFace>;
  currentIndex: number;
}

export const saveMixedSession = (snapshot: MixedSessionSnapshot): void => {
  try {
    sessionStorage.setItem(MIXED_SESSION_KEY, JSON.stringify(snapshot));
  } catch {
    // sessionStorage may be unavailable
  }
};

export const loadMixedSession = (): MixedSessionSnapshot | null => {
  try {
    const raw = sessionStorage.getItem(MIXED_SESSION_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as MixedSessionSnapshot;
  } catch {
    return null;
  }
};

export const clearMixedSession = (): void => {
  try {
    sessionStorage.removeItem(MIXED_SESSION_KEY);
  } catch {
    // ignore
  }
};
