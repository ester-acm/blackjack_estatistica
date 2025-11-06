import React from 'react';

interface CasinoChipsProps {
  balance: number;
  currentBet: number;
  onBet: (amount: number) => void;
  onClearBet: () => void;
  disabled: boolean;
}

const CHIP_VALUES = [5, 10, 25, 100, 500];
const CHIP_COLORS: { [key: number]: string } = {
  5: 'bg-red-500 border-red-700 hover:bg-red-600',
  10: 'bg-blue-500 border-blue-700 hover:bg-blue-600',
  25: 'bg-green-500 border-green-700 hover:bg-green-600',
  100: 'bg-gray-800 border-black hover:bg-gray-900',
  500: 'bg-purple-500 border-purple-700 hover:bg-purple-600',
};

const CasinoChips: React.FC<CasinoChipsProps> = ({ balance, currentBet, onBet, onClearBet, disabled }) => {
  return (
    <div className="flex flex-col items-center space-y-4 my-4">
      <div className="text-xl font-semibold text-white bg-black bg-opacity-25 px-4 py-2 rounded-lg">
        Aposta: <span className="text-yellow-400 font-mono">${currentBet}</span> | Saldo: <span className="text-green-400 font-mono">${balance}</span>
      </div>
      <div className="flex items-center space-x-2">
        {CHIP_VALUES.map(value => (
          <button
            key={value}
            onClick={() => onBet(value)}
            disabled={disabled || balance < value}
            className={`w-16 h-16 rounded-full font-bold text-white text-lg shadow-lg transition-transform transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border-4 flex items-center justify-center ${CHIP_COLORS[value]}`}
          >
            ${value}
          </button>
        ))}
        <button
          onClick={onClearBet}
          disabled={disabled || currentBet === 0}
          className="ml-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg shadow-lg disabled:opacity-50"
        >
          Limpar
        </button>
      </div>
    </div>
  );
};

export default CasinoChips;
