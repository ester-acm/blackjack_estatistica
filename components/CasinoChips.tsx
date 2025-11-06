import React from 'react';

const Chip: React.FC<{ value: number; color: string; onBet: (amount: number) => void; disabled: boolean; }> = ({ value, color, onBet, disabled }) => {
  const formatValue = (val: number) => {
    if (val >= 1000) return `${val / 1000}K`;
    return val.toString();
  };

  return (
    <button
      onClick={() => onBet(value)}
      disabled={disabled}
      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full font-bold text-white text-lg sm:text-xl shadow-lg transition-transform transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-yellow-400/50 ${color}`}
    >
      <div className="absolute inset-[4px] sm:inset-[5px] border-2 sm:border-[3px] border-white/70 rounded-full"></div>
      <div className="absolute inset-[6px] sm:inset-[7px] border sm:border-2 border-black/30 rounded-full"></div>
      <span className="relative z-10 [text-shadow:0_2px_2px_rgba(0,0,0,0.8)]">{formatValue(value)}</span>
    </button>
  );
};


interface CasinoChipsProps {
  balance: number;
  onBet: (amount: number) => void;
  disabled: boolean;
}

const CHIP_DATA = [
  { value: 100, color: 'bg-gradient-to-br from-blue-500 to-blue-700' },
  { value: 500, color: 'bg-gradient-to-br from-red-600 to-red-800' },
  { value: 1000, color: 'bg-gradient-to-br from-green-500 to-green-700' },
  { value: 10000, color: 'bg-gradient-to-br from-purple-600 to-purple-800' },
  { value: 50000, color: 'bg-gradient-to-br from-gray-700 to-gray-900' },
];

const CasinoChips: React.FC<CasinoChipsProps> = ({ balance, onBet, disabled }) => {
  return (
    <div className="flex items-center justify-center space-x-1 sm:space-x-2">
      {CHIP_DATA.map(({ value, color }) => (
        <Chip
          key={value}
          value={value}
          color={color}
          onBet={onBet}
          disabled={disabled || balance < value}
        />
      ))}
    </div>
  );
};

export default CasinoChips;