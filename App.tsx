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

function App() {
  const [shoe, setShoe] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [playerScore, setPlayerScore] = useState({ value: 0, soft: false });
  const [dealerScore, setDealerScore] = useState({ value: 0, soft: false });
  const [gameState, setGameState] = useState<GameState>(GameState.PRE_DEAL);
  const [handResult, setHandResult] = useState<HandResult | null>(null);
  const [balance, setBalance] = useState(1000);
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
      alert("Por favor, faça uma aposta.");
      return;
    }
    
    let currentShoe = [...shoe];

    if (currentShoe.length < (52 * NUMBER_OF_DECKS * RESHUFFLE_THRESHOLD)) {
        alert("Reembaralhando o deck...");
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

      while (dScoreDetails.value < 17 || (dScoreDetails.value === 17 && dScoreDetails.soft)) {
          const newCard = currentShoe.pop()!;
          currentDealerHand.push(newCard);
          updateCountAndComposition(newCard);
          dScoreDetails = calculateHandValue(currentDealerHand);
      }
      
      setDealerHand(currentDealerHand);
      setShoe(currentShoe);
      
      const pFinalScore = calculateHandValue(playerHand);
      const dFinalScore = calculateHandValue(currentDealerHand);
      const pBlackjack = pFinalScore.value === 21 && playerHand.length === 2;
      const dBlackjack = dFinalScore.value === 21 && currentDealerHand.length === 2;
      
      determineWinner(pFinalScore.value, dFinalScore.value, pBlackjack, dBlackjack);
      setGameState(GameState.HAND_OVER);
    }
  }, [gameState, dealerHand, playerHand, shoe, determineWinner, updateCountAndComposition]);

  const getAiSuggestion = useCallback(async () => {
    if (gameState !== GameState.PLAYER_TURN || playerHand.length < 2 || dealerHand.length < 1) return;
    setAiSuggestion('Pensando...');
    try {
      const prompt = `You are a Blackjack strategy expert. Based on the Hi-Lo card counting system, give a concise suggestion in Portuguese (Bater, Ficar, Dobrar, ou Dividir). Do not explain your reasoning. Just provide the word. Player's hand: ${playerHand.map(c => c.rank).join(', ')} (Value: ${playerScore.value}). Dealer's up card: ${dealerHand[0].rank}. True Count: ${trueCount.toFixed(2)}. Suggestion:`;
      
      // Per coding guidelines, use ai.models.generateContent
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      // Per coding guidelines, access text directly from response
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
    <div className="bg-green-800 min-h-screen text-white font-sans flex flex-col items-center p-4 selection:bg-yellow-500 selection:text-black">
      <h1 className="text-5xl font-bold mb-4">Blackjack Pro</h1>

      <div className="w-full flex flex-col lg:flex-row justify-center items-start gap-8">
        <div className="flex-grow flex flex-col items-center">
            {/* Game Table */}
            <div className="bg-green-700 p-6 rounded-t-full w-full max-w-4xl border-4 border-yellow-800 shadow-2xl relative">
                <div className="absolute top-4 right-4 text-sm text-gray-300">
                    Cartas no deck: {shoe.length}
                </div>
                {/* Dealer's Hand */}
                <div className="mb-8 min-h-[190px]">
                    <h2 className="text-2xl font-semibold mb-2 text-center">Mesa ({dealerScore.value > 0 ? `${dealerScore.value}` : ''})</h2>
                    <div className="flex justify-center items-center h-40 space-x-2">
                        {dealerHand.length > 0 ? dealerHand.map((card, index) => (
                            <PlayingCard key={index} card={card} hidden={gameState === GameState.PLAYER_TURN && index === 1} />
                        )) : <div className="h-36 w-24"></div>}
                    </div>
                </div>

                {/* Hand Result */}
                {handResult && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-black text-center text-yellow-300 my-4 animate-pulse bg-black bg-opacity-50 p-4 rounded-xl">
                        {handResult}
                    </div>
                )}
                
                {/* Player's Hand */}
                <div className="min-h-[190px]">
                    <h2 className="text-2xl font-semibold mb-2 text-center">Você ({playerScore.value > 0 ? `${playerScore.value}` : ''})</h2>
                    <div className="flex justify-center items-center h-40 space-x-2">
                         {playerHand.length > 0 ? playerHand.map((card, index) => (
                            <PlayingCard key={index} card={card} />
                        )) : <div className="h-36 w-24"></div>}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-900 p-4 w-full max-w-4xl rounded-b-lg shadow-inner">
                {gameState === GameState.PRE_DEAL && (
                    <>
                        <CasinoChips 
                            balance={balance} 
                            currentBet={currentBet} 
                            onBet={placeBet} 
                            onClearBet={clearBet}
                            disabled={false}
                        />
                        <button 
                            onClick={dealHand}
                            disabled={currentBet === 0}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg text-xl disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                        >
                            Distribuir Cartas
                        </button>
                    </>
                )}

                {handInProgress && (
                    <div className="flex justify-center space-x-4">
                        <button onClick={hit} disabled={playerScore.value >= 21} className="bg-blue-500 hover:bg-blue-600 font-bold py-3 px-6 rounded-lg text-xl disabled:opacity-50 transition-colors">Comprar</button>
                        <button onClick={stand} className="bg-red-500 hover:bg-red-600 font-bold py-3 px-6 rounded-lg text-xl transition-colors">Parar</button>
                    </div>
                )}

                {gameState === GameState.HAND_OVER && (
                    <button onClick={resetHand} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg text-xl transition-colors">
                        Nova Mão
                    </button>
                )}
            </div>
        </div>
        
        {/* Stats */}
        <div className="w-full lg:w-auto mt-8 lg:mt-0">
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
