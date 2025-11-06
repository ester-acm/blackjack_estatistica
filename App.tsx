
import React, { useState, useEffect, useCallback } from 'react';
// Correct import from @google/genai
import { GoogleGenAI } from "@google/genai";
import { Card, GameState, HandResult, HandHistoryEntry, Rank } from './types';
import { createShoe, calculateHandValue, getCardCountValue, getBustProbability } from './services/gameLogic';
import PlayingCard from './components/PlayingCard';
import StatsDashboard from './components/StatsDashboard';
import CasinoChips from './components/CasinoChips';
import { RANKS, RESHUFFLE_THRESHOLD, NUMBER_OF_DECKS } from './constants';

// Per coding guidelines, initialize GoogleGenAI with an object containing the apiKey from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ScoreDisplay = ({ score }: { score: number }) => (
  <div className="bg-black/50 backdrop-blur-sm text-white font-bold text-xl px-4 py-1 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)] mb-2">
    {score}
  </div>
);

const CHIP_DATA_FOR_PILE = [
  { value: 50000, color: 'bg-gradient-to-br from-gray-600 to-gray-800' },
  { value: 10000, color: 'bg-gradient-to-br from-purple-600 to-purple-800' },
  { value: 1000, color: 'bg-gradient-to-br from-green-500 to-green-700' },
  { value: 500, color: 'bg-gradient-to-br from-red-600 to-red-800' },
  { value: 100, color: 'bg-gradient-to-br from-blue-500 to-blue-700' },
];

const ChipForPile: React.FC<{ color: string; style?: React.CSSProperties }> = ({ color, style }) => (
    <div
      style={style}
      className={`absolute w-16 h-16 rounded-full shadow-lg ${color} border-2 border-white/20`}
    >
      <div className="absolute inset-[4px] border-2 border-white/60 rounded-full"></div>
      <div className="absolute inset-[6px] border border-black/20 rounded-full"></div>
    </div>
);

const BettingPile = ({ bet }: { bet: number }) => {
    if (bet === 0) return null;

    let remainingBet = bet;
    // FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
    const chipStacks: React.ReactElement[][] = [];

    CHIP_DATA_FOR_PILE.forEach(({ value, color }) => {
      const count = Math.floor(remainingBet / value);
      if (count > 0) {
        // FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
        const stack: React.ReactElement[] = [];
        for (let i = 0; i < Math.min(count, 5); i++) { // Limit to 5 visible chips per stack
          stack.push(<ChipForPile key={`${value}-${i}`} color={color} style={{ transform: `translateY(-${i * 8}px)` }} />);
        }
        chipStacks.push(stack);
        remainingBet %= value;
      }
    });

    return (
      <div className="flex items-end -space-x-8">
        {chipStacks.map((stack, index) => (
          <div key={index} className="relative w-16 h-20 filter drop-shadow-lg">
            {stack}
          </div>
        ))}
      </div>
    );
};


function App() {
  const [shoe, setShoe] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [playerScore, setPlayerScore] = useState({ value: 0, soft: false });
  const [dealerScore, setDealerScore] = useState({ value: 0, soft: false });
  const [gameState, setGameState] = useState<GameState>(GameState.PRE_DEAL);
  const [handResult, setHandResult] = useState<HandResult | null>(null);
  const [balance, setBalance] = useState(170000);
  const [currentBet, setCurrentBet] = useState(0);
  const [runningCount, setRunningCount] = useState(0);
  const [aiSuggestion, setAiSuggestion] = useState('');
  
  const initialDeckComposition = useCallback(() => RANKS.reduce((acc, rank) => {
    acc[rank] = 4 * NUMBER_OF_DECKS;
    return acc;
  }, {} as { [key in Rank]: number }), []);

  const [deckComposition, setDeckComposition] = useState(initialDeckComposition);
  const [handHistory, setHandHistory] = useState<HandHistoryEntry[]>([]);
  
  const updateCountAndComposition = useCallback((card: Card, revealed = true) => {
    if (revealed) {
        setRunningCount(prev => prev + getCardCountValue(card));
        setDeckComposition(prev => ({ ...prev, [card.rank]: prev[card.rank] - 1 }));
    }
  }, []);

  useEffect(() => {
    setShoe(createShoe());
    setRunningCount(0);
    setDeckComposition(initialDeckComposition());
  }, [initialDeckComposition]);

  const decksRemaining = shoe.length / 52;
  const trueCount = decksRemaining > 0 ? runningCount / decksRemaining : 0;
  const bustProbability = getBustProbability(playerScore.value, shoe);

  const placeBet = (amount: number) => {
    if (amount <= balance) {
      setCurrentBet(prev => prev + amount);
      setBalance(prev => prev - amount);
    }
  };

  const clearBet = () => {
    setBalance(prev => prev + currentBet);
    setCurrentBet(0);
  };

  const dealHand = useCallback(() => {
    if (currentBet === 0) {
      return;
    }
    
    let currentShoe = [...shoe];

    if (currentShoe.length < (52 * NUMBER_OF_DECKS * RESHUFFLE_THRESHOLD)) {
        alert("Re-shuffling the shoe...");
        currentShoe = createShoe();
        setShoe(currentShoe);
        setRunningCount(0);
        setDeckComposition(initialDeckComposition());
    }

    setGameState(GameState.PLAYER_TURN);
    setHandResult(null);
    setAiSuggestion('');

    const pHand: Card[] = [currentShoe.pop()!, currentShoe.pop()!];
    const dHand: Card[] = [currentShoe.pop()!, currentShoe.pop()!];
    
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setShoe(currentShoe);

    updateCountAndComposition(pHand[0]);
    updateCountAndComposition(pHand[1]);
    updateCountAndComposition(dHand[0]);
  }, [currentBet, shoe, updateCountAndComposition, initialDeckComposition]);

  const hit = useCallback(() => {
    if (gameState !== GameState.PLAYER_TURN) return;
    const newShoe = [...shoe];
    const newCard = newShoe.pop()!;
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    setShoe(newShoe);
    updateCountAndComposition(newCard);
  }, [gameState, shoe, playerHand, updateCountAndComposition]);

  const stand = useCallback(() => {
    if (gameState !== GameState.PLAYER_TURN) return;
    setGameState(GameState.DEALER_TURN);
  }, [gameState]);

  const determineWinner = useCallback((pScore: number, dScore: number, pBlackjack: boolean, dBlackjack: boolean) => {
    let result: HandResult;
    let betMultiplier = 1;

    if (pBlackjack && !dBlackjack) {
        result = HandResult.PLAYER_BLACKJACK;
        betMultiplier = 2.5;
    } else if (pScore > 21) {
        result = HandResult.PLAYER_BUST;
        betMultiplier = 0;
    } else if (dScore > 21) {
        result = HandResult.DEALER_BUST;
        betMultiplier = 2;
    } else if (dScore > pScore) {
        result = HandResult.DEALER_WIN;
        betMultiplier = 0;
    } else if (pScore > dScore) {
        result = HandResult.PLAYER_WIN;
        betMultiplier = 2;
    } else {
        result = HandResult.PUSH;
        betMultiplier = 1;
    }

    setHandResult(result);
    setBalance(prev => prev + currentBet * betMultiplier);
    
    setHandHistory(prev => [...prev, {
        result,
        playerHand,
        dealerHand,
        playerScore: pScore,
        dealerScore: dScore,
    }]);

  }, [currentBet, playerHand, dealerHand]);

  useEffect(() => {
    const pScore = calculateHandValue(playerHand);
    setPlayerScore(pScore);
    if (pScore.value > 21) {
      stand();
    }
  }, [playerHand, stand]);
  
  useEffect(() => {
    const revealedDealerHand = (gameState === GameState.PLAYER_TURN) ? [dealerHand[0]] : dealerHand;
    if(revealedDealerHand.length > 0 && revealedDealerHand[0] !== undefined) {
        const calculatedDealerScore = calculateHandValue(revealedDealerHand);
        setDealerScore(calculatedDealerScore);
    } else {
        setDealerScore({ value: 0, soft: false });
    }
  }, [dealerHand, gameState]);

  useEffect(() => {
    if (gameState === GameState.PLAYER_TURN && playerHand.length === 2 && calculateHandValue(playerHand).value === 21) {
      stand();
    }
  }, [gameState, playerHand, stand]);


  // Dealer's turn logic
  useEffect(() => {
    if (gameState === GameState.DEALER_TURN) {
      updateCountAndComposition(dealerHand[1]); // Reveal hole card

      let currentDealerHand = [...dealerHand];
      let currentShoe = [...shoe];
      let dScoreDetails = calculateHandValue(currentDealerHand);

      const dealerPlay = () => {
          if (dScoreDetails.value < 17 || (dScoreDetails.value === 17 && dScoreDetails.soft)) {
              const newCard = currentShoe.pop()!;
              currentDealerHand.push(newCard);
              updateCountAndComposition(newCard);
              dScoreDetails = calculateHandValue(currentDealerHand);
              setDealerHand([...currentDealerHand]);
              setShoe([...currentShoe]);
              setTimeout(dealerPlay, 800);
          } else {
              const pFinalScore = calculateHandValue(playerHand);
              const dFinalScore = calculateHandValue(currentDealerHand);
              const pBlackjack = pFinalScore.value === 21 && playerHand.length === 2;
              const dBlackjack = dFinalScore.value === 21 && dealerHand.length === 2;
              
              determineWinner(pFinalScore.value, dFinalScore.value, pBlackjack, dBlackjack);
              setGameState(GameState.HAND_OVER);
          }
      };
      setTimeout(dealerPlay, 800);
    }
  }, [gameState, dealerHand, playerHand, shoe, determineWinner, updateCountAndComposition]);

  const getAiSuggestion = useCallback(async () => {
    if (gameState !== GameState.PLAYER_TURN || playerHand.length < 2 || dealerHand.length < 1) return;
    setAiSuggestion('Pensando...');
    try {
      const prompt = `You are a Blackjack strategy expert. Based on the Hi-Lo card counting system, give a concise suggestion in Portuguese (Bater, Ficar, Dobrar, ou Dividir). Do not explain your reasoning. Just provide the word. Player's hand: ${playerHand.map(c => c.rank).join(', ')} (Value: ${playerScore.value}). Dealer's up card: ${dealerHand[0].rank}. True Count: ${trueCount.toFixed(2)}. Suggestion:`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const suggestion = response.text.trim();
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error("Error fetching AI suggestion:", error);
      setAiSuggestion('Erro na sugestão');
    }
  }, [gameState, playerHand, dealerHand, playerScore.value, trueCount]);

  useEffect(() => {
    if (gameState === GameState.PLAYER_TURN) {
      getAiSuggestion();
    }
  }, [gameState, playerHand, getAiSuggestion]);

  const resetHand = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setPlayerScore({ value: 0, soft: false });
    setDealerScore({ value: 0, soft: false });
    setCurrentBet(0);
    setGameState(GameState.PRE_DEAL);
    setHandResult(null);
  };
  
  const handInProgress = gameState === GameState.PLAYER_TURN || gameState === GameState.DEALER_TURN;

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-2 sm:p-4 selection:bg-yellow-500 selection:text-black">

      <div className="w-full flex flex-col xl:flex-row justify-center items-center xl:items-start gap-4">
        
        <div className="flex-grow flex flex-col items-center w-full max-w-7xl">
            {/* Game Table */}
            <div className="relative w-full aspect-[16/9] p-4 bg-gradient-to-br from-[#8c5a3b] via-[#6b4226] to-[#4a2e1a] rounded-[6rem] sm:rounded-[8rem] md:rounded-[10rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <div className="relative w-full h-full bg-gradient-to-br from-green-700 via-green-800 to-green-900 rounded-[5rem] sm:rounded-[7rem] md:rounded-[9rem] shadow-[inset_0_0_50px_rgba(0,0,0,0.9)] bg-[url('https://www.transparenttextures.com/patterns/felt.png')] flex flex-col justify-between items-center py-10 px-6">
              
                {/* TOP ROW: Dealer Hand & Card Shoe */}
                <div className="w-full relative flex justify-center items-start min-h-[220px]">
                    <div className="absolute top-0 left-4 w-28 h-40 bg-gradient-to-br from-yellow-900 to-yellow-950 rounded-lg shadow-lg transform -rotate-6 border-2 border-black/30">
                      <div className="absolute inset-1 rounded-md border-2 border-yellow-700/50 bg-yellow-900 flex items-center justify-center">
                          <div className="w-20 h-32 bg-red-800 rounded-md border-2 border-red-900/50 shadow-inner [background-image:repeating-linear-gradient(45deg,_transparent,_transparent_5px,_rgba(255,255,255,0.05)_5px,_rgba(255,255,255,0.05)_10px)]"></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                        <div className="flex justify-center items-center h-40 space-x-[-50px]">
                            {dealerHand.length > 0 ? dealerHand.map((card, index) => (
                                <PlayingCard key={index} card={card} hidden={gameState === GameState.PLAYER_TURN && index === 1} />
                            )) : <div className="h-36 w-24"></div>}
                        </div>
                        {dealerScore.value > 0 && <ScoreDisplay score={dealerScore.value} />}
                    </div>

                    <div className="absolute top-4 right-12 text-center">
                        <p className="font-bold text-white/80 text-lg [text-shadow:0_2px_4px_#000]">Bid:</p>
                        <p className="text-3xl font-semibold text-yellow-300 [text-shadow:0_2px_4px_#000]">${currentBet.toLocaleString()}</p>
                    </div>
                </div>

                {/* MIDDLE ROW: Result & Betting Pile */}
                <div className="w-full relative flex justify-center items-center min-h-[140px]">
                    {handResult && (
                      <div className="absolute z-20 text-5xl font-black text-center text-yellow-300 my-4 bg-black/70 backdrop-blur-sm p-4 rounded-xl shadow-lg" style={{textShadow: '0 2px 5px rgba(0,0,0,0.7), 0 0 12px #fef08a'}}>
                          {handResult}
                      </div>
                    )}
                    { currentBet > 0 && 
                      <div className="absolute z-10 flex items-center justify-center">
                        <BettingPile bet={currentBet} />
                      </div>
                    }
                </div>

                {/* BOTTOM ROW: Player Hand & Balance */}
                <div className="w-full relative flex justify-center items-end min-h-[220px]">
                   <div className="absolute bottom-4 left-12 text-center">
                        <p className="font-bold text-white/80 text-lg [text-shadow:0_2px_4px_#000]">Balance:</p>
                        <p className="text-3xl font-semibold text-yellow-300 [text-shadow:0_2px_4px_#000]">${balance.toLocaleString()}</p>
                    </div>
                   <div className="flex flex-col items-center">
                        {playerScore.value > 0 && <ScoreDisplay score={playerScore.value} />}
                       <div className="flex justify-center items-center h-40 space-x-[-50px]">
                           {playerHand.length > 0 ? playerHand.map((card, index) => (
                              <PlayingCard key={index} card={card} />
                          )) : <div className="h-36 w-24"></div>}
                       </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-900/40 backdrop-blur-sm p-4 w-full mt-4 rounded-xl shadow-lg border-t-2 border-white/20">
              {gameState === GameState.PRE_DEAL && (
                   <div className="flex flex-col items-center gap-4">
                      <p className="text-xl font-bold text-white/80 drop-shadow-lg [text-shadow:0_1px_2px_#000]">Place your bet:</p>
                      <CasinoChips balance={balance} onBet={placeBet} disabled={false} />
                      <div className="flex w-full gap-4 max-w-md mx-auto mt-2">
                          <button onClick={clearBet} disabled={currentBet === 0} className="flex-1 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-3 px-4 rounded-lg text-xl disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
                              Clear
                          </button>
                          <button onClick={dealHand} disabled={currentBet === 0} className="flex-[2] bg-gradient-to-b from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-bold py-3 px-4 rounded-lg text-xl disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
                              Deal
                          </button>
                      </div>
                   </div>
              )}
              {handInProgress && (
                <div className="flex justify-center space-x-4 max-w-md mx-auto">
                    <button onClick={hit} disabled={playerScore.value >= 21} className="w-1/2 bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 font-bold py-3 px-6 rounded-lg text-xl disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">Hit</button>
                    <button onClick={stand} className="w-1/2 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 font-bold py-3 px-6 rounded-lg text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">Stand</button>
                </div>
              )}
              {gameState === GameState.HAND_OVER && (
                  <div className="max-w-md mx-auto">
                    <button onClick={resetHand} className="w-full bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 px-4 rounded-lg text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
                        New Hand
                    </button>
                  </div>
              )}
            </div>
        </div>
        
        <div className="w-full lg:w-auto lg:mt-24">
            <StatsDashboard 
                runningCount={runningCount}
                trueCount={trueCount}
                bustProbability={bustProbability}
                deckComposition={deckComposition}
                aiSuggestion={aiSuggestion}
            />
        </div>
      </div>
    </div>
  );
}

export default App;
