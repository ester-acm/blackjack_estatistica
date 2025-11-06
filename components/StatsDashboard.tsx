import React from 'react';
import DeckCompositionChart from './DeckCompositionChart';
import { Rank } from '../types';

interface StatsDashboardProps {
  runningCount: number;
  trueCount: number;
  bustProbability: number;
  deckComposition: { [key in Rank]: number };
  aiSuggestion: string;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({
  runningCount,
  trueCount,
  bustProbability,
  deckComposition,
  aiSuggestion
}) => {
  const getCountColor = (count: number) => {
    if (count > 0) return 'text-green-400';
    if (count < 0) return 'text-red-400';
    return 'text-gray-300';
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white w-full max-w-sm lg:max-w-xs xl:max-w-sm">
      <h2 className="text-2xl font-bold mb-4 text-center border-b border-gray-600 pb-2">Estatísticas</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center bg-gray-700 p-2 rounded-lg">
          <p className="text-sm text-gray-400">Contagem Contínua</p>
          <p className={`text-3xl font-bold ${getCountColor(runningCount)}`}>{runningCount}</p>
        </div>
        <div className="text-center bg-gray-700 p-2 rounded-lg">
          <p className="text-sm text-gray-400">Contagem Verdadeira</p>
          <p className={`text-3xl font-bold ${getCountColor(trueCount)}`}>{trueCount.toFixed(2)}</p>
        </div>
      </div>
      <div className="text-center mb-4 bg-gray-700 p-2 rounded-lg">
        <p className="text-sm text-gray-400">Prob. de Estourar ao Comprar</p>
        <p className="text-3xl font-bold text-yellow-400">{bustProbability.toFixed(2)}%</p>
      </div>
       <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-center">Sugestão da IA (Gemini)</h3>
          <div className="bg-gray-900 p-3 rounded-lg text-center min-h-[60px] flex items-center justify-center">
              <p className="text-xl text-cyan-400 font-mono">{aiSuggestion || 'Aguardando sua vez...'}</p>
          </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-center">Composição do deck</h3>
        <DeckCompositionChart deckComposition={deckComposition} />
      </div>
    </div>
  );
};

export default StatsDashboard;
