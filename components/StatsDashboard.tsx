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
  
  const hasSuggestion = aiSuggestion && aiSuggestion !== 'Aguardando sua vez...' && aiSuggestion !== 'Pensando...' && aiSuggestion !== 'Erro na sugestão';

  const getBustProbGradient = (prob: number) => {
    if (prob > 60) return 'from-red-500 to-orange-400';
    if (prob > 35) return 'from-orange-400 to-yellow-400';
    return 'from-yellow-400 to-amber-300';
  }

  return (
    <div className="bg-black/30 backdrop-blur-lg p-4 rounded-2xl shadow-2xl text-gray-100 w-full max-w-sm lg:max-w-xs xl:max-w-sm border border-white/10">
      <h2 className="text-2xl font-bold mb-4 text-center border-b border-white/20 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">Estatísticas</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center bg-black/20 p-2 rounded-lg border border-white/10">
          <p className="text-sm text-gray-300">Contagem Contínua</p>
          <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-cyan-400 to-blue-600">{runningCount}</p>
        </div>
        <div className="text-center bg-black/20 p-2 rounded-lg border border-white/10">
          <p className="text-sm text-gray-300">Contagem Verdadeira</p>
          <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-teal-300 to-cyan-500">{trueCount.toFixed(2)}</p>
        </div>
      </div>
      <div className="text-center mb-4 bg-black/20 p-2 rounded-lg border border-white/10">
        <p className="text-sm text-gray-300">Prob. de Estourar</p>
        <p className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br ${getBustProbGradient(bustProbability)}`}>{bustProbability.toFixed(2)}%</p>
      </div>
       <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">Sugestão da IA (Gemini)</h3>
          <div className={`bg-black/20 p-3 rounded-lg text-center min-h-[70px] flex items-center justify-center transition-all duration-300 border border-white/10 ${hasSuggestion ? 'animate-pulse-glow' : ''}`}>
              <p className="text-2xl text-cyan-300 font-semibold filter drop-shadow-[0_0_5px_#00dcfd]">{aiSuggestion || 'Aguardando sua vez...'}</p>
          </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">Composição do Deck</h3>
        <DeckCompositionChart deckComposition={deckComposition} />
      </div>
    </div>
  );
};

export default StatsDashboard;
