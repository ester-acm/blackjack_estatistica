import React from 'react';
import { Card, Suit, Rank } from '../types';

interface PlayingCardProps {
  card: Card;
  hidden?: boolean;
}

const PlayingCard: React.FC<PlayingCardProps> = ({ card, hidden }) => {
  if (hidden) {
    return <div className="w-24 h-36 bg-blue-700 rounded-lg border-2 border-white flex items-center justify-center shadow-lg">
        <div className="w-20 h-32 bg-blue-800 rounded-md border-2 border-blue-500"></div>
    </div>;
  }

  const color = card.suit === Suit.Hearts || card.suit === Suit.Diamonds ? 'text-red-500' : 'text-black';

  const isFaceCard = card.rank === Rank.Jack || card.rank === Rank.Queen || card.rank === Rank.King;

  return (
    <div className={`w-24 h-36 bg-white rounded-lg shadow-md flex flex-col justify-between p-2 font-bold text-2xl ${color} relative overflow-hidden`}>
      <div className="flex flex-col items-start">
        <div className="text-3xl leading-none">{card.rank}</div>
        <div className="text-xl leading-none">{card.suit}</div>
      </div>
      {isFaceCard && <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-20">{card.rank}</div>}
      <div className="flex flex-col items-end self-end transform rotate-180">
        <div className="text-3xl leading-none">{card.rank}</div>
        <div className="text-xl leading-none">{card.suit}</div>
      </div>
    </div>
  );
};

export default PlayingCard;
