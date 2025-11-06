
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Rank } from '../types';

interface DeckCompositionChartProps {
  deckComposition: { [key in Rank]: number };
}

const highValueCards = [Rank.Ten, Rank.Jack, Rank.Queen, Rank.King, Rank.Ace];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const isHigh = highValueCards.includes(label as Rank);
    const gradientFrom = isHigh ? 'from-red-500/50' : 'from-cyan-500/50';
    const gradientTo = 'to-black/60';

    return (
      <div className={`p-3 rounded-lg shadow-xl border border-white/20 bg-gradient-to-br ${gradientFrom} ${gradientTo} backdrop-blur-md`}>
        <p className="text-lg font-bold text-white">{`Carta: ${label}`}</p>
        <p className="text-md text-gray-200">{`Quantidade: ${data.value}`}</p>
      </div>
    );
  }
  return null;
};

const DeckCompositionChart: React.FC<DeckCompositionChartProps> = ({ deckComposition }) => {
  const data = Object.entries(deckComposition).map(([name, value]) => ({ name, value }));
  
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fill: '#a0aec0' }} fontSize={12} axisLine={{ stroke: '#4a5568' }} tickLine={{ stroke: '#4a5568' }} />
          <YAxis tick={{ fill: '#a0aec0' }} fontSize={12} axisLine={{ stroke: '#4a5568' }} tickLine={{ stroke: '#4a5568' }} />
          <Tooltip 
            cursor={{ fill: 'rgba(0, 180, 255, 0.1)' }}
            content={<CustomTooltip />}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={highValueCards.includes(entry.name as Rank) ? '#f56565' : '#38bdf8'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeckCompositionChart;