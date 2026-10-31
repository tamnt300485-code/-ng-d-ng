import React, { useState } from 'react';
import { Gamepad2, Trophy, Fuel, Sparkles } from 'lucide-react';
import { FlappyGame } from './games/FlappyGame';
import { SnakeGame } from './games/SnakeGame';

export const GameHubSection: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<'flappy' | 'snake'>('flappy');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#003B70] via-[#00558F] to-[#ED1C24] rounded-3xl text-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs text-amber-300">
            <Trophy className="w-4 h-4" />
            <span>Khu vực trò chơi giải trí tại quầy giao dịch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Chờ Vui – Chơi Hay – Nhận Quà Liền Tay!
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl">
            Trong lúc chờ đến lượt giao dịch, Quý khách hãy tham gia mini-game thư giãn để nhận ngay mã <strong>Voucher 2 lít xăng</strong> từ VietinBank.
          </p>
        </div>

        {/* Game Switcher Tabs */}
        <div className="bg-black/20 p-1.5 rounded-2xl flex items-center backdrop-blur-md border border-white/20 shrink-0">
          <button
            onClick={() => setSelectedGame('flappy')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 ${
              selectedGame === 'flappy'
                ? 'bg-white text-[#00558F] shadow-md scale-102'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Fuel className="w-4 h-4 text-red-500" />
            <span>Game 1: Flappy Bird</span>
          </button>

          <button
            onClick={() => setSelectedGame('snake')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 ${
              selectedGame === 'snake'
                ? 'bg-white text-[#00558F] shadow-md scale-102'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-emerald-600" />
            <span>Game 2: Rắn săn mồi</span>
          </button>
        </div>
      </div>

      {/* Render Active Game */}
      <div className="py-2">
        {selectedGame === 'flappy' ? <FlappyGame /> : <SnakeGame />}
      </div>
    </div>
  );
};
