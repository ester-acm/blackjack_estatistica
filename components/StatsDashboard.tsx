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
  
  const hasSuggestion = aiSuggestion && aiSuggestion !== 'Aguardando sua vez...' && aiSuggestion !== 'Pensando...' && aiSuggestion !== 'Erro na sugestão';

  return (
    <div className="bg-gray-900/40 backdrop-blur-sm p-4 rounded-lg shadow-lg text-gray-100 w-full max-w-sm lg:max-w-xs xl:max-w-sm border-t-2 border-white/20">
      <h2 className="text-2xl font-bold mb-4 text-center border-b border-gray-600/50 pb-2">Estatísticas</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center bg-black/20 p-2 rounded-lg">
          <p className="text-sm text-gray-300">Contagem Contínua</p>
          <p className={`text-3xl font-bold ${getCountColor(runningCount)}`}>{runningCount}</p>
        </div>
        <div className="text-center bg-black/20 p-2 rounded-lg">
          <p className="text-sm text-gray-300">Contagem Verdadeira</p>
          <p className={`text-3xl font-bold ${getCountColor(trueCount)}`}>{trueCount.toFixed(2)}</p>
        </div>
      </div>
      <div className="text-center mb-4 bg-black/20 p-2 rounded-lg">
        <p className="text-sm text-gray-300">Prob. de Estourar ao Comprar</p>
        <p className="text-3xl font-bold text-yellow-400">{bustProbability.toFixed(2)}%</p>
      </div>
       <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-center">Sugestão da IA (Gemini)</h3>
          <div className={`bg-black/20 p-3 rounded-lg text-center min-h-[70px] flex items-center justify-center transition-all duration-300 ${hasSuggestion ? 'shadow-[0_0_15px_rgba(56,189,248,0.6)]' : ''}`}>
              <p className="text-xl text-cyan-300 font-semibold">{aiSuggestion || 'Aguardando sua vez...'}</p>
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