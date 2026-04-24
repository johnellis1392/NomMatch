/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Gender = 'boy' | 'girl' | 'neutral';

export interface NameInfo {
  id: string;
  name: string;
  gender: Gender;
  origin: string;
  meaning?: string;
  etymology?: string;
  history?: string;
  roots?: string[];
  popularity?: Record<number, number>; // year -> rank
}

export interface UserStats {
  likedIds: string[];
  seenIds: string[];
  dislikedIds: string[];
}

export interface CompetitionMatch {
  id: string;
  competitorA: string; // nameId
  competitorB: string; // nameId
  winnerId?: string;
}

export interface Tournament {
  id: string;
  rounds: CompetitionMatch[][];
  winnerId?: string;
}
