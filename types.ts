export enum Suit {
  Spades = '♠',
  Clubs = '♣',
  Hearts = '♥',
  Diamonds = '♦',
}

export enum Rank {
  Ace = 'A',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10',
  Jack = 'J',
  Queen = 'Q',
  King = 'K',
}

export interface Card {
  suit: Suit;
  rank: Rank;
}

export interface Hand {
  cards: Card[];
  value: number;
}

export enum GameState {
  PRE_DEAL = 'PRE_DEAL',
  PLAYER_TURN = 'PLAYER_TURN',
  DEALER_TURN = 'DEALER_TURN',
  HAND_OVER = 'HAND_OVER',
}

export enum HandResult {
  PLAYER_WIN = 'Você Venceu!',
  DEALER_WIN = 'A Mesa Venceu',
  PUSH = 'Empate',
  PLAYER_BLACKJACK = 'Blackjack!',
  PLAYER_BUST = 'Estourou!',
  DEALER_BUST = 'Mesa Estourou!',
}

export interface HandHistoryEntry {
  result: HandResult;
  playerHand: Card[];
  dealerHand: Card[];
  playerScore: number;
  dealerScore: number;
}