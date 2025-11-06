
import { Card, Rank, Hand } from '../types';
import { SUITS, RANKS, CARD_VALUES, NUMBER_OF_DECKS, CARD_COUNT_VALUES } from '../constants';

export const createShoe = (): Card[] => {
  let shoe: Card[] = [];
  for (let i = 0; i < NUMBER_OF_DECKS; i++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        shoe.push({ suit, rank });
      }
    }
  }
  return shuffle(shoe);
};

const shuffle = (deck: Card[]): Card[] => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export const calculateHandValue = (cards: Card[]): { value: number, soft: boolean } => {
  let value = 0;
  let aceCount = 0;
  for (const card of cards) {
    if (card.rank === Rank.Ace) {
      aceCount++;
      value += 11;
    } else {
      value += CARD_VALUES[card.rank][0];
    }
  }

  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }
  
  const soft = aceCount > 0 && value <= 21;

  return { value, soft };
};

export const getCardCountValue = (card: Card): number => {
    return CARD_COUNT_VALUES[card.rank];
}

export const getBustProbability = (playerHandValue: number, remainingDeck: Card[]): number => {
    if (playerHandValue >= 21) return 100;

    const bustValue = 22 - playerHandValue;
    if (bustValue <= 1) return 100;
    if (bustValue > 11) return 0;
    
    const bustCards = remainingDeck.filter(card => {
        const cardValue = CARD_VALUES[card.rank].length > 1 ? 11 : CARD_VALUES[card.rank][0];
        return cardValue >= bustValue;
    });

    if(remainingDeck.length === 0) return 0;

    return (bustCards.length / remainingDeck.length) * 100;
}
