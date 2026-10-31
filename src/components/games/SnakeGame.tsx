import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Play,
  RotateCcw,
  Fuel,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Calendar,
  Award,
  Sparkles,
} from 'lucide-react';

interface SnakeCertificate {
  score: number;
  rewardTier: string;
  voucherCode: string;
  timestamp: string;
}

const GRID_SIZE = 16;
const GAME_SPEED = 135; // friendly comfortable speed for all ages

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE');
  const [score, setScore] = useState<number>(0);
  const [highestReward, setHighestReward] = useState<string>('Chưa đạt');
  const [milestonePopup, setMilestonePopup] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<SnakeCertificate | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // References for snake loop
  const snakeRef = useRef<Array<{ x: number; y: number }>>([
    { x: 8, y: 8 },
    { x: 7, y: 8 },
    { x: 6, y: 8 },
  ]);
  const directionRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const nextDirectionRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const foodRef = useRef<{ x: number; y: number }>({ x: 12, y: 8 });
  const intervalIdRef = useRef<number | null>(null);
  const scoreRef = useRef<number>(0);

  const generateVoucherCode = () => {
    const random6 = Math.floor(100000 + Math.random() * 900000);
    return `VB-SNAKE-${random6}`;
  };

  const spawnFood = () => {
    let newX = Math.floor(Math.random() * GRID_SIZE);
    let newY = Math.floor(Math.random() * GRID_SIZE);
    // ensure not on snake
    while (snakeRef.current.some((segment) => segment.x === newX && segment.y === newY)) {
      newX = Math.floor(Math.random() * GRID_SIZE);
      newY = Math.floor(Math.random() * GRID_SIZE);
    }
    foodRef.current = { x: newX, y: newY };
  };

  const showMilestoneNotification = (text: string) => {
    setMilestonePopup(text);
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#00558F', '#ED1C24', '#FDB913'],
      });
    } catch {}
    setTimeout(() => {
      setMilestonePopup(null);
    }, 3500);
  };

  const handleEndGame = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    setGameState('GAMEOVER');

    const finalScore = scoreRef.current;
    let rewardTier = '';
    if (finalScore >= 40) {
      rewardTier = '02 voucher xăng, mỗi voucher trị giá 2 lít';
    } else if (finalScore >= 20) {
      rewardTier = '01 voucher xăng trị giá 2 lít';
    } else {
      rewardTier = 'Chưa đạt mốc nhận voucher';
    }

    if (finalScore >= 20) {
      const code = generateVoucherCode();
      const cert: SnakeCertificate = {
        score: finalScore,
        rewardTier,
        voucherCode: code,
        timestamp: new Date().toLocaleString('vi-VN'),
      };
      setCertificate(cert);
    } else {
      setCertificate({
        score: finalScore,
        rewardTier: 'Chưa đạt',
        voucherCode: 'N/A',
        timestamp: new Date().toLocaleString('vi-VN'),
      });
    }
  }, []);

  const changeDirection = (dx: number, dy: number) => {
    const current = directionRef.current;
    // prevent reverse
    if (current.x + dx === 0 && current.y + dy === 0) return;
    nextDirectionRef.current = { x: dx, y: dy };
  };

  const startGame = () => {
    snakeRef.current = [
      { x: 8, y: 8 },
      { x: 7, y: 8 },
      { x: 6, y: 8 },
    ];
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    scoreRef.current = 0;
    setScore(0);
    setHighestReward('Chưa đạt');
    setCertificate(null);
    setMilestonePopup(null);
    spawnFood();
    setGameState('PLAYING');

    if (intervalIdRef.current) clearInterval(intervalIdRef.current);

    intervalIdRef.current = window.setInterval(() => {
      // Move snake
      directionRef.current = nextDirectionRef.current;
      const head = {
        x: snakeRef.current[0].x + directionRef.current.x,
        y: snakeRef.current[0].y + directionRef.current.y,
      };

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        handleEndGame();
        return;
      }

      // Self collision
      if (snakeRef.current.some((seg) => seg.x === head.x && seg.y === head.y)) {
        handleEndGame();
        return;
      }

      const newSnake = [head, ...snakeRef.current];

      // Eat food
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        scoreRef.current += 1;
        setScore(scoreRef.current);

        // Milestone reward triggers
        if (scoreRef.current === 20) {
          setHighestReward('01 Voucher 2L');
          showMilestoneNotification(
            'Chúc mừng Quý khách đã đạt 20 điểm! Quý khách nhận được 01 voucher xăng trị giá 2 lít.'
          );
        } else if (scoreRef.current === 40) {
          setHighestReward('02 Voucher 2L');
          showMilestoneNotification(
            'Xuất sắc! Quý khách đã đạt 40 điểm! Quý khách nhận được 02 voucher xăng, mỗi voucher trị giá 2 lít.'
          );
        }

        spawnFood();
      } else {
        newSnake.pop();
      }

      snakeRef.current = newSnake;
      drawCanvas();
    }, GAME_SPEED);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellW = canvas.width / GRID_SIZE;
    const cellH = canvas.height / GRID_SIZE;

    // Background grid
    ctx.fillStyle = '#0a1d37';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle checkered pattern
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if ((r + c) % 2 === 0) {
          ctx.fillStyle = '#0e2544';
          ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
        }
      }
    }

    // Draw Food (Gold coin / VietinBank gem)
    const fx = foodRef.current.x * cellW + cellW / 2;
    const fy = foodRef.current.y * cellH + cellH / 2;
    ctx.beginPath();
    ctx.arc(fx, fy, cellW * 0.42, 0, Math.PI * 2);
    ctx.fillStyle = '#FDB913';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    ctx.fillStyle = '#78350F';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', fx, fy);

    // Draw Snake
    snakeRef.current.forEach((segment, idx) => {
      const sx = segment.x * cellW;
      const sy = segment.y * cellH;

      if (idx === 0) {
        // Head
        ctx.fillStyle = '#ED1C24';
        ctx.beginPath();
        ctx.roundRect(sx + 1, sy + 1, cellW - 2, cellH - 2, 6);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(sx + cellW * 0.35, sy + cellH * 0.35, 2.5, 0, Math.PI * 2);
        ctx.arc(sx + cellW * 0.65, sy + cellH * 0.35, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Body (VietinBank blues)
        ctx.fillStyle = idx % 2 === 0 ? '#00558F' : '#0070BA';
        ctx.beginPath();
        ctx.roundRect(sx + 2, sy + 2, cellW - 4, cellH - 4, 4);
        ctx.fill();
      }
    });
  };

  useEffect(() => {
    drawCanvas();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        changeDirection(0, -1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        changeDirection(0, 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        changeDirection(-1, 0);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        changeDirection(1, 0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  useEffect(() => {
    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden max-w-2xl mx-auto p-4 sm:p-6 space-y-4">
      {/* Title & Subtitle as specified */}
      <div className="pb-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
            Game 2: Rắn săn mồi
          </span>
          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            VietinBank Snake Challenge
          </h3>
          <p className="text-xs text-slate-500">
            Chơi vui tại quầy – Săn voucher xăng hấp dẫn
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-[#00558F] font-bold text-xs sm:text-sm">
            Điểm: {score}
          </div>
          <div className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs">
            Thưởng: {highestReward}
          </div>
        </div>
      </div>

      {/* Rules Banner */}
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Mục tiêu: Đạt 20 điểm nhận 01 Voucher 2L • Đạt 40 điểm nhận 02 Voucher 2L</span>
        </div>
      </div>

      {/* Milestone popup on-the-fly without interrupting game */}
      {milestonePopup && (
        <div className="p-3 bg-gradient-to-r from-amber-500 to-red-600 text-white rounded-xl font-bold text-xs sm:text-sm text-center shadow-lg animate-in slide-in-from-top duration-300">
          {milestonePopup}
        </div>
      )}

      {/* Canvas Area */}
      <div className="relative w-full aspect-square max-w-[380px] mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-slate-800">
        <canvas
          ref={canvasRef}
          width={360}
          height={360}
          className="w-full h-full object-cover"
        />

        {/* Start Overlay */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00558F] to-[#ED1C24] flex items-center justify-center shadow-md">
              <Trophy className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <h4 className="text-xl font-black text-amber-300">VietinBank Snake</h4>
              <p className="text-xs text-slate-200 mt-1 max-w-xs">
                Dùng phím mũi tên hoặc bàn phím ảo bên dưới để điều khiển rắn ăn điểm thưởng.
              </p>
            </div>
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ED1C24] to-[#D8232A] hover:brightness-110 text-white font-extrabold text-sm shadow-lg flex items-center space-x-2"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Bắt đầu chơi</span>
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-3 overflow-y-auto">
            <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-400" />
            </div>

            <h4 className="text-base sm:text-lg font-bold text-white">Kết thúc lượt chơi</h4>

            {score < 20 ? (
              <p className="text-xs text-amber-200 max-w-xs">
                Rất tiếc, Quý khách đạt {score} điểm và chưa đạt mốc nhận voucher. Hãy thử lại để chinh phục mốc 20 điểm!
              </p>
            ) : score < 40 ? (
              <p className="text-xs text-emerald-300 max-w-xs font-semibold">
                Chúc mừng Quý khách! Quý khách đạt {score} điểm và đủ điều kiện nhận 01 voucher xăng trị giá 2 lít.
              </p>
            ) : (
              <p className="text-xs text-emerald-300 max-w-xs font-semibold">
                Chúc mừng Quý khách! Quý khách đạt {score} điểm và đủ điều kiện nhận 02 voucher xăng, mỗi voucher trị giá 2 lít.
              </p>
            )}

            <button
              onClick={startGame}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi lại</span>
            </button>
          </div>
        )}
      </div>

      {/* On-screen Virtual D-Pad for Mobile & Tablets at bank counters */}
      <div className="flex flex-col items-center justify-center gap-1.5 pt-2">
        <button
          onClick={() => changeDirection(0, -1)}
          className="w-12 h-12 rounded-xl bg-slate-100 active:bg-blue-600 active:text-white text-slate-700 flex items-center justify-center shadow-xs transition-colors border border-slate-200"
          aria-label="Lên"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => changeDirection(-1, 0)}
            className="w-12 h-12 rounded-xl bg-slate-100 active:bg-blue-600 active:text-white text-slate-700 flex items-center justify-center shadow-xs transition-colors border border-slate-200"
            aria-label="Trái"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#00558F] font-bold text-xs flex items-center justify-center border border-blue-200">
            {score}đ
          </div>
          <button
            onClick={() => changeDirection(1, 0)}
            className="w-12 h-12 rounded-xl bg-slate-100 active:bg-blue-600 active:text-white text-slate-700 flex items-center justify-center shadow-xs transition-colors border border-slate-200"
            aria-label="Phải"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
        <button
          onClick={() => changeDirection(0, 1)}
          className="w-12 h-12 rounded-xl bg-slate-100 active:bg-blue-600 active:text-white text-slate-700 flex items-center justify-center shadow-xs transition-colors border border-slate-200"
          aria-label="Xuống"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>

      {/* Phiếu xác nhận quà tặng as strictly required in PDF 6 Page 8 */}
      {certificate && certificate.score >= 20 && (
        <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 border-2 border-dashed border-amber-300 rounded-3xl p-5 space-y-3 shadow-md animate-in fade-in">
          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-red-600" />
              <span className="font-black text-slate-900 text-sm uppercase tracking-wider">
                Phiếu Xác Nhận Quà Tặng VietinBank
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-600 text-white">
              Hợp Lệ
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white/80 p-2.5 rounded-xl border border-amber-100">
              <span className="text-slate-500 block">Điểm cuối cùng:</span>
              <strong className="text-base font-extrabold text-[#00558F]">
                {certificate.score} Điểm
              </strong>
            </div>

            <div className="bg-white/80 p-2.5 rounded-xl border border-amber-100">
              <span className="text-slate-500 block">Mức quà đạt được:</span>
              <strong className="text-xs font-bold text-red-600">
                {certificate.rewardTier}
              </strong>
            </div>

            <div className="col-span-2 bg-white/90 p-3 rounded-xl border border-amber-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Mã quà tặng điện tử:</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(certificate.voucherCode);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#00558F] hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã sao chép' : 'Sao chép mã'}</span>
                </button>
              </div>
              <div className="text-lg font-black tracking-widest text-slate-900 font-mono">
                {certificate.voucherCode}
              </div>
              <div className="flex items-center space-x-1 text-[11px] text-slate-500 pt-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Thời gian hoàn thành: {certificate.timestamp}</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 font-semibold text-center">
            Vui lòng chụp màn hình hoặc thông báo với giao dịch viên để nhận quà.
          </div>
        </div>
      )}
    </div>
  );
};
