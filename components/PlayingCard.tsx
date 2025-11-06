import React from 'react';
import { Card, Suit, Rank } from '../types';

interface PlayingCardProps {
  card: Card;
  hidden?: boolean;
}

const PlayingCard: React.FC<PlayingCardProps> = ({ card, hidden }) => {
  if (hidden) {
    return (
      <div 
        className="w-24 h-36 bg-gradient-to-br from-blue-800 to-blue-950 rounded-lg border-2 border-gray-400/50 p-1 shadow-lg"
      >
        <div className="w-full h-full rounded-md border-2 border-gray-500/30 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-yellow-400/30 rounded-full"></div>
        </div>
      </div>
    );
  }

  const color = card.suit === Suit.Hearts || card.suit === Suit.Diamonds ? 'text-red-600' : 'text-black';
  
  const isFaceCard = [Rank.Jack, Rank.Queen, Rank.King].includes(card.rank);

  return (
    <div 
      className={`w-24 h-36 bg-gray-100 rounded-lg shadow-lg flex flex-col justify-between p-1 font-bold text-lg ${color} relative overflow-hidden border border-gray-300 transition-transform duration-300 transform hover:scale-105 hover:-translate-y-2`}
    >
      <div className="flex flex-col items-center leading-none">
        <span className="text-2xl">{card.rank}</span>
        <span>{card.suit}</span>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 select-none" aria-hidden="true">
        {card.suit}
      </div>
      
      <div className="flex flex-col items-center self-end transform rotate-180 leading-none">
        <span className="text-2xl">{card.rank}</span>
        <span>{card.suit}</span>
      </div>
    </div>
  );
};

export default PlayingCard;