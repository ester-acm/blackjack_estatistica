import React from 'react';
import DeckCompositionChart from './DeckCompositionChart';
import { Rank } from '../types';
import { UI_TEXT, Language } from '../constants';

interface StatsDashboardProps {
  runningCount: number;
  trueCount: number;
  bustProbability: number;
  deckComposition: { [key in Rank]: number };
  aiSuggestion: string;
  language?: Language;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({
  runningCount,
  trueCount,
  bustProbability,
  deckComposition,
  aiSuggestion,
  language = 'pt'
}) => {
  const t = UI_TEXT[language];
  
  const hasSuggestion = aiSuggestion && aiSuggestion !== t.waiting && aiSuggestion !== t.thinking && aiSuggestion !== t.suggestionError;

  const getBustProbGradient = (prob: number) => {
    if (prob > 60) return 'from-red-500 to-orange-400';
    if (prob > 35) return 'from-orange-400 to-yellow-400';
    return 'from-yellow-400 to-amber-300';
  }

  return (
    <div className="bg-black/30 backdrop-blur-lg p-4 rounded-2xl shadow-2xl text-gray-100 w-full max-w-sm lg:max-w-xs xl:max-w-sm border border-white/10">
      <h2 className="text-2xl font-bold mb-4 text-center border-b border-white/20 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">{t.statistics}</h2>
      <div className="text-center mb-4 bg-black/20 p-2 rounded-lg border border-white/10">
        <p className="text-sm text-gray-300">{t.bustProbability}</p>
        <p className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br ${getBustProbGradient(bustProbability)}`}>{bustProbability.toFixed(2)}%</p>
      </div>
       <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">{t.aiSuggestion}</h3>
          <div className={`bg-black/20 p-3 rounded-lg text-center min-h-[70px] flex items-center justify-center transition-all duration-300 border border-white/10 ${hasSuggestion ? 'animate-pulse-glow' : ''}`}>
              <p className="text-2xl text-cyan-300 font-semibold filter drop-shadow-[0_0_5px_#00dcfd]">{aiSuggestion || t.waiting}</p>
          </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">{t.deckComposition}</h3>
        <DeckCompositionChart deckComposition={deckComposition} />
      </div>
    </div>
  );
};

export default StatsDashboard;
