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
      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full font-bold text-white text-lg sm:text-xl shadow-lg transition-all duration-200 transform hover:-translate-y-2 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-yellow-400/50 active:scale-95 group`}
    >
      {/* Main chip body with gradient */}
      <div className={`absolute inset-0 rounded-full bg-gradient-radial ${color} border-2 border-white/50`}></div>
      
      {/* Glossy overlay */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent"></div>
      
      {/* Edge stripes container */}
      <div className="absolute inset-[6px] sm:inset-[7px] border-2 border-white/80 rounded-full"></div>
      
      {/* Inner shadow for depth */}
      <div className="absolute inset-[8px] sm:inset-[9px] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"></div>

      <span className="relative z-10 filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{formatValue(value)}</span>
    </button>
  );
};


interface CasinoChipsProps {
  balance: number;
  onBet: (amount: number) => void;
  disabled: boolean;
}

const CHIP_DATA = [
  { value: 100, color: 'from-blue-500 to-blue-800' },
  { value: 500, color: 'from-red-500 to-red-800' },
  { value: 1000, color: 'from-green-500 to-green-800' },
  { value: 10000, color: 'from-purple-600 to-purple-900' },
  { value: 50000, color: 'from-gray-600 to-gray-900' },
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
