import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, LineChart, Line, CartesianGrid } from 'recharts';
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

// Hypergeometric distribution: probability of drawing k successes in n draws without replacement
const hypergeometricProbability = (
  populationSize: number,
  successStates: number,
  draws: number,
  successes: number
): number => {
  // C(K, k) * C(N-K, n-k) / C(N, n)
  const combination = (n: number, k: number): number => {
    if (k > n || k < 0) return 0;
    if (k === 0 || k === n) return 1;
    k = Math.min(k, n - k);
    let result = 1;
    for (let i = 0; i < k; i++) {
      result *= (n - i) / (i + 1);
    }
    return result;
  };

  const numerator = combination(successStates, successes) * combination(populationSize - successStates, draws - successes);
  const denominator = combination(populationSize, draws);
  
  return numerator / denominator;
};

const DeckCompositionChart: React.FC<DeckCompositionChartProps> = ({ deckComposition }) => {
  const data: { name: Rank; value: number }[] = Object.entries(deckComposition).map(([name, value]) => ({ name: name as Rank, value: value as number }));
  
  // Calculate statistics
  const values: number[] = data.map(d => d.value);
  const average = values.reduce((a: number, b: number) => a + b, 0) / values.length;
  const variance = values.reduce((a: number, b: number) => a + Math.pow(b - average, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const max = Math.max(...values);
  const min = Math.min(...values);
  
  // Calculate hypergeometric distribution for high-value cards (10-value cards)
  const totalCards = values.reduce((a: number, b: number) => a + b, 0);
  const highValueCount = data
    .filter(d => highValueCards.includes(d.name))
    .reduce((a: number, b) => a + b.value, 0);
  
  // Probability of drawing high-value cards in next 5, 10, 15 hands
  const hypergeometricData = [
    { hand: '5 cartas', probability: hypergeometricProbability(totalCards, highValueCount, 5, 3) * 100 },
    { hand: '10 cartas', probability: hypergeometricProbability(totalCards, highValueCount, 10, 6) * 100 },
    { hand: '15 cartas', probability: hypergeometricProbability(totalCards, highValueCount, 15, 9) * 100 },
  ];
  
  return (
    <div className="w-full space-y-4">
      {/* Deck Composition Bar Chart */}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fill: '#a0aec0' }} fontSize={12} axisLine={{ stroke: '#4a5568' }} tickLine={{ stroke: '#4a5568' }} />
            <YAxis tick={{ fill: '#a0aec0' }} fontSize={12} axisLine={{ stroke: '#4a5568' }} tickLine={{ stroke: '#4a5568' }} />
            <Tooltip 
              cursor={{ fill: 'rgba(0, 180, 255, 0.1)' }}
              content={<CustomTooltip />}
            />
            <ReferenceLine 
              y={average} 
              stroke="#fbbf24" 
              strokeDasharray="5 5" 
              label={{ value: `Média: ${average.toFixed(1)}`, position: 'right', fill: '#fbbf24', fontSize: 11 }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={highValueCards.includes(entry.name as Rank) ? '#f56565' : '#38bdf8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Statistics Panel */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-black/20 p-2 rounded border border-white/10">
          <p className="text-gray-400">Média</p>
          <p className="text-cyan-300 font-bold">{average.toFixed(1)}</p>
        </div>
        <div className="bg-black/20 p-2 rounded border border-white/10">
          <p className="text-gray-400">Desvio Padrão</p>
          <p className="text-cyan-300 font-bold">{stdDev.toFixed(2)}</p>
        </div>
        <div className="bg-black/20 p-2 rounded border border-white/10">
          <p className="text-gray-400">Máximo</p>
          <p className="text-green-300 font-bold">{max}</p>
        </div>
        <div className="bg-black/20 p-2 rounded border border-white/10">
          <p className="text-gray-400">Mínimo</p>
          <p className="text-red-300 font-bold">{min}</p>
        </div>
      </div>

      {/* Hypergeometric Distribution Chart */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Distribuição Hipergeométrica - Cartas Altas</h4>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hypergeometricData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis dataKey="hand" tick={{ fill: '#a0aec0' }} fontSize={11} axisLine={{ stroke: '#4a5568' }} tickLine={{ stroke: '#4a5568' }} />
              <YAxis tick={{ fill: '#a0aec0' }} fontSize={11} axisLine={{ stroke: '#4a5568' }} tickLine={{ stroke: '#4a5568' }} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                cursor={{ fill: 'rgba(245, 101, 101, 0.1)' }}
                contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}
                formatter={(value: any) => `${(value as number).toFixed(2)}%`}
              />
              <Bar dataKey="probability" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Probabilidade de encontrar múltiplas cartas altas (10, J, Q, K, A) nos próximos sorteios
        </p>
      </div>
    </div>
  );
};

export default DeckCompositionChart;