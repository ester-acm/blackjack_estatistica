import React from 'react';
import { Card, Suit, Rank } from '../types';

interface PlayingCardProps {
  card: Card;
  hidden?: boolean;
  animated?: boolean;
  delay?: number;
}

const PlayingCard: React.FC<PlayingCardProps> = ({ card, hidden, animated, delay = 0 }) => {
  
  const CardBack = () => (
    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-900 to-[#1a1a2e] rounded-lg border-2 border-gray-400/30 p-1 shadow-lg backface-hidden transform rotate-y-180">
      <div className="w-full h-full rounded-md border-2 border-blue-400/20 bg-[radial-gradient(ellipse_at_center,_rgba(0,150,255,0.1)_0%,_transparent_70%)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-400/20 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-cyan-400/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  const CardFace = ({ card }: { card: Card }) => {
    const color = card.suit === Suit.Hearts || card.suit === Suit.Diamonds ? 'text-red-500' : 'text-black';
    return (
      <div className={`absolute inset-0 w-full h-full bg-gray-50 rounded-lg shadow-lg flex flex-col justify-between p-1 font-bold text-lg ${color} relative overflow-hidden border border-gray-300 backface-hidden`}>
        <div className="flex flex-col items-center leading-none">
          <span className="text-2xl">{card.rank}</span>
          <span>{card.suit}</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-10 select-none" aria-hidden="true">
          {card.suit}
        </div>
        <div className="flex flex-col items-center self-end transform rotate-180 leading-none">
          <span className="text-2xl">{card.rank}</span>
          <span>{card.suit}</span>
        </div>
      </div>
    );
  };
  
  const animationClass = animated ? 'animate-deal-card' : '';
  const animationStyle = { animationDelay: `${delay}ms` };

  return (
    <div className="w-24 h-36 perspective-1000">
      <div 
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d transform hover:-translate-y-3 hover:scale-105 ${animationClass}`}
        style={{ ...animationStyle, transform: hidden ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        <CardFace card={card} />
        <CardBack />
      </div>
    </div>
  );
};

export default PlayingCard;
