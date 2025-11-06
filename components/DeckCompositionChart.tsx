
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Rank } from '../types';

interface DeckCompositionChartProps {
  deckComposition: { [key in Rank]: number };
}

const DeckCompositionChart: React.FC<DeckCompositionChartProps> = ({ deckComposition }) => {
  const data = Object.entries(deckComposition).map(([name, value]) => ({ name, value }));
  const highValueCards = [Rank.Ten, Rank.Jack, Rank.Queen, Rank.King, Rank.Ace];

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fill: '#a0aec0' }} fontSize={12} />
          <YAxis tick={{ fill: '#a0aec0' }} fontSize={12} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568', color: '#e2e8f0' }}
            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={highValueCards.includes(entry.name as Rank) ? '#f56565' : '#4299e1'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeckCompositionChart;
