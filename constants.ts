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

// UI Translations
export const UI_TEXT = {
  pt: {
    bid: 'Aposta',
    balance: 'Saldo',
    placeBet: 'Faça sua aposta:',
    clear: 'Limpar',
    deal: 'Distribuir',
    hit: 'Bater',
    stand: 'Ficar',
    newHand: 'Nova Mão',
    thinking: 'Pensando...',
    suggestionError: 'Erro na sugestão',
    dealerHoleCard: 'Verso da carta',
    cardLabel: (rank: string, suit: string) => `${rank} de ${suit}`,
    waiting: 'Aguardando sua vez...',
    statistics: 'Estatísticas',
    runningCount: 'Contagem Contínua',
    trueCount: 'Contagem Verdadeira',
    bustProbability: 'Prob. de Estourar',
    aiSuggestion: 'Sugestão da IA (Gemini)',
    deckComposition: 'Composição do Deck',
  },
  en: {
    bid: 'Bid',
    balance: 'Balance',
    placeBet: 'Place your bet:',
    clear: 'Clear',
    deal: 'Deal',
    hit: 'Hit',
    stand: 'Stand',
    newHand: 'New Hand',
    thinking: 'Thinking...',
    suggestionError: 'Suggestion error',
    dealerHoleCard: 'Card back',
    cardLabel: (rank: string, suit: string) => `${rank} of ${suit}`,
    waiting: 'Waiting for your turn...',
    statistics: 'Statistics',
    runningCount: 'Running Count',
    trueCount: 'True Count',
    bustProbability: 'Bust Probability',
    aiSuggestion: 'AI Suggestion (Gemini)',
    deckComposition: 'Deck Composition',
  },
};

export type Language = 'pt' | 'en';

