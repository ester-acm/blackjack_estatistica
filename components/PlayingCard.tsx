import React from 'react';
import { Card } from '../types';

interface PlayingCardProps {
  card: Card;
  hidden?: boolean;  // só o dealer usa isso
  animated?: boolean;
  delay?: number;
}

// converte símbolo do naipe (♠ ♥ ♦ ♣) para letra usada nas imagens da API
const suitSymbolToLetter = (suit: string): string => {
  switch (suit) {
    case '♠': return 'S'; // Spades
    case '♥': return 'H'; // Hearts
    case '♦': return 'D'; // Diamonds
    case '♣': return 'C'; // Clubs
    default: return 'S';
  }
};

// corrige o “10” da API (a API usa “0” no lugar de “10”)
const rankToApi = (rank: string): string => (rank === '10' ? '0' : rank);

const PlayingCard: React.FC<PlayingCardProps> = ({ card, hidden = false, animated = false, delay = 0 }) => {
  // se hidden = true, mostra o verso; caso contrário, mostra a frente
  const cardImage = hidden
    ? 'https://deckofcardsapi.com/static/img/back.png'
    : `https://deckofcardsapi.com/static/img/${rankToApi(card.rank)}${suitSymbolToLetter(card.suit)}.png`;

  const animationClass = animated ? 'animate-deal-card' : '';
  const animationStyle = { animationDelay: `${delay}ms` };

  return (
    <div className="w-24 h-36 perspective-1000">
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d hover:-translate-y-3 hover:scale-105 ${animationClass}`}
        style={{ ...animationStyle }}
      >
        {/* Frente da carta */}
        <div className="absolute inset-0 w-full h-full rounded-lg shadow-lg border border-gray-300 backface-hidden overflow-hidden">
          <img
            src={cardImage}
            alt={hidden ? 'Verso da carta' : `${card.rank} de ${card.suit}`}
            className="w-full h-full object-cover rounded-lg"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayingCard;
