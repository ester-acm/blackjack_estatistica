import { Suit, Rank } from './types';

export const SUITS: Suit[] = [Suit.Spades, Suit.Clubs, Suit.Hearts, Suit.Diamonds];
export const RANKS: Rank[] = [
  Rank.Ace, Rank.Two, Rank.Three, Rank.Four, Rank.Five, Rank.Six, Rank.Seven,
  Rank.Eight, Rank.Nine, Rank.Ten, Rank.Jack, Rank.Queen, Rank.King
];

export const CARD_VALUES: { [key in Rank]: number[] } = {
  [Rank.Ace]: [1, 11],
  [Rank.Two]: [2],
  [Rank.Three]: [3],
  [Rank.Four]: [4],
  [Rank.Five]: [5],
  [Rank.Six]: [6],
  [Rank.Seven]: [7],
  [Rank.Eight]: [8],
  [Rank.Nine]: [9],
  [Rank.Ten]: [10],
  [Rank.Jack]: [10],
  [Rank.Queen]: [10],
  [Rank.King]: [10],
};

// Hi-Lo Card Counting System
export const CARD_COUNT_VALUES: { [key in Rank]: number } = {
    [Rank.Two]: 1, [Rank.Three]: 1, [Rank.Four]: 1, [Rank.Five]: 1, [Rank.Six]: 1,
    [Rank.Seven]: 0, [Rank.Eight]: 0, [Rank.Nine]: 0,
    [Rank.Ten]: -1, [Rank.Jack]: -1, [Rank.Queen]: -1, [Rank.King]: -1, [Rank.Ace]: -1,
};

export const NUMBER_OF_DECKS = 6;
export const RESHUFFLE_THRESHOLD = 0.25; // Reshuffle when 25% of the shoe remains
