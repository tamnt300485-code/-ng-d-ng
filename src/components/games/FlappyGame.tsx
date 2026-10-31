import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Fuel,
  Sparkles,
  Info,
} from 'lucide-react';
import contentData from '../../data/contentData.json';

// Global callback declaration
declare global {
  interface Window {
    onFlappyVoucherWin?: (data: {
      score: number;
      voucherCode: string;
      reward: string;
      timestamp: string;
    }) => void;
    onFlappyVoucherLose?: (data: {
      score: number;
      timestamp: string;
    }) => void;
  }
}

// Config variables
const WIN_SCORE = 20;
const GRAVITY = 0.38;
const JUMP_FORCE = -6.8;
const PIPE_SPEED = 2.2;
const PIPE_GAP = 165;
const VOUCHER_TEXT = 'Voucher 2 lít xăng';
const BRAND_NAME = 'VietinBank';
const GAME_TITLE = 'Chờ vui – Chơi hay – Nhận quà liền tay';

export const FlappyGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER' | 'VICTORY'>('START');
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [latestVoucher, setLatestVoucher] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Game internal state kept in refs for 60fps loop
  const birdRef = useRef({
    x: 60,
    y: 200,
    radius: 18,
    velocity: 0,
    rotation: 0,
  });

  const pipesRef = useRef<Array<{ x: number; top: number; bottom: number; passed: boolean }>>([]);
  const frameCountRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const scoreRef = useRef<number>(0);
  const gameStateRef = useRef<'START' | 'PLAYING' | 'GAMEOVER' | 'VICTORY'>('START');

  // Load persistence from localStorage
  useEffect(() => {
    try {
      const savedBest = localStorage.getItem('vietinbank_flappy_best');
      const savedVoucher = localStorage.getItem('vietinbank_flappy_latest_voucher');
      if (savedBest) setBestScore(parseInt(savedBest, 10));
      if (savedVoucher) setLatestVoucher(savedVoucher);
    } catch {
      // localStorage may fail in iframe/strict mode
    }
  }, []);

  const generateVoucherCode = () => {
    const random6 = Math.floor(100000 + Math.random() * 900000);
    return `VB-${random6}`;
  };

  const playBeep = (freq = 440, type: OscillatorType = 'sine', duration = 0.1) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext muted/unsupported
    }
  };

  const triggerVibrate = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(80);
      } catch {
        // Ignored
      }
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00558F', '#ED1C24', '#FDB913', '#ffffff'],
      });
    } catch {
      // Fallback
    }
  };

  const getEncouragement = (s: number) => {
    if (s < 5) return 'Khởi động nhẹ nhàng!';
    if (s < 10) return 'Tốt lắm, tiếp tục nào!';
    if (s < 15) return 'Một nửa chặng đường rồi!';
    if (s < 20) return 'Sắp nhận quà rồi!';
    return 'Xuất sắc!';
  };

  const winGame = useCallback((finalScore: number) => {
    gameStateRef.current = 'VICTORY';
    setGameState('VICTORY');
    playBeep(880, 'triangle', 0.4);
    triggerConfetti();

    const code = generateVoucherCode();
    setVoucherCode(code);
    setLatestVoucher(code);

    try {
      localStorage.setItem('vietinbank_flappy_latest_voucher', code);
      localStorage.setItem('vietinbank_flappy_best', '20');
      setBestScore(20);
    } catch {}

    if (window.onFlappyVoucherWin) {
      window.onFlappyVoucherWin({
        score: 20,
        voucherCode: code,
        reward: VOUCHER_TEXT,
        timestamp: new Date().toISOString(),
      });
    }
  }, [soundEnabled]);

  const endGame = useCallback((finalScore: number) => {
    gameStateRef.current = 'GAMEOVER';
    setGameState('GAMEOVER');
    triggerVibrate();
    playBeep(180, 'sawtooth', 0.25);

    try {
      if (finalScore > bestScore) {
        localStorage.setItem('vietinbank_flappy_best', finalScore.toString());
        setBestScore(finalScore);
      }
    } catch {}

    if (window.onFlappyVoucherLose) {
      window.onFlappyVoucherLose({
        score: finalScore,
        timestamp: new Date().toISOString(),
      });
    }
  }, [bestScore, soundEnabled]);

  const jump = useCallback(() => {
    if (gameStateRef.current !== 'PLAYING') return;
    birdRef.current.velocity = JUMP_FORCE;
    playBeep(520, 'sine', 0.08);
  }, [soundEnabled]);

  const startGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    birdRef.current = {
      x: 70,
      y: canvas.height / 2,
      radius: 17,
      velocity: 0,
      rotation: 0,
    };
    pipesRef.current = [];
    frameCountRef.current = 0;
    scoreRef.current = 0;
    setScore(0);
    gameStateRef.current = 'PLAYING';
    setGameState('PLAYING');
  };

  const resetGame = () => {
    startGame();
  };

  const copyVoucherCode = () => {
    if (!voucherCode) return;
    navigator.clipboard.writeText(voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameStateRef.current === 'PLAYING') {
          jump();
        } else if (gameStateRef.current === 'START' || gameStateRef.current === 'GAMEOVER') {
          startGame();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  // Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const loop = () => {
      if (!isRunning) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear & Draw Sky
      ctx.clearRect(0, 0, width, height);

      // Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#e0f2fe');
      skyGrad.addColorStop(0.7, '#f0f9ff');
      skyGrad.addColorStop(1, '#ecfeff');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Distant clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(80, 70, 30, 0, Math.PI * 2);
      ctx.arc(110, 65, 38, 0, Math.PI * 2);
      ctx.arc(140, 70, 28, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(280, 110, 24, 0, Math.PI * 2);
      ctx.arc(305, 105, 30, 0, Math.PI * 2);
      ctx.arc(330, 110, 22, 0, Math.PI * 2);
      ctx.fill();

      // Floor ground
      const groundHeight = 45;
      const groundY = height - groundHeight;
      ctx.fillStyle = '#003B70';
      ctx.fillRect(0, groundY, width, groundHeight);
      ctx.fillStyle = '#ED1C24';
      ctx.fillRect(0, groundY, width, 5);

      if (gameStateRef.current === 'PLAYING') {
        frameCountRef.current++;

        // Spawn Pipes
        if (frameCountRef.current % 120 === 0) {
          const minTop = 60;
          const maxTop = groundY - PIPE_GAP - 60;
          const topHeight = Math.floor(minTop + Math.random() * (maxTop - minTop));
          pipesRef.current.push({
            x: width,
            top: topHeight,
            bottom: groundY - (topHeight + PIPE_GAP),
            passed: false,
          });
        }

        // Update Pipes
        const pipeWidth = 56;
        for (let i = pipesRef.current.length - 1; i >= 0; i--) {
          const pipe = pipesRef.current[i];
          pipe.x -= PIPE_SPEED;

          // Check score pass
          if (!pipe.passed && pipe.x + pipeWidth < birdRef.current.x) {
            pipe.passed = true;
            scoreRef.current += 1;
            setScore(scoreRef.current);
            playBeep(660, 'sine', 0.1);

            if (scoreRef.current >= WIN_SCORE) {
              winGame(scoreRef.current);
              return;
            }
          }

          // Remove off-screen pipes
          if (pipe.x + pipeWidth < -20) {
            pipesRef.current.splice(i, 1);
          }
        }

        // Bird Physics
        birdRef.current.velocity += GRAVITY;
        birdRef.current.y += birdRef.current.velocity;
        birdRef.current.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 6, (birdRef.current.velocity * 4 * Math.PI) / 180));

        // Ground / Ceiling Collision
        if (birdRef.current.y + birdRef.current.radius >= groundY) {
          birdRef.current.y = groundY - birdRef.current.radius;
          endGame(scoreRef.current);
          return;
        }
        if (birdRef.current.y - birdRef.current.radius <= 0) {
          birdRef.current.y = birdRef.current.radius;
          birdRef.current.velocity = 0;
        }

        // Pipe Collision
        const bx = birdRef.current.x;
        const by = birdRef.current.y;
        const br = birdRef.current.radius - 2;

        for (const pipe of pipesRef.current) {
          if (bx + br > pipe.x && bx - br < pipe.x + pipeWidth) {
            if (by - br < pipe.top || by + br > groundY - pipe.bottom) {
              endGame(scoreRef.current);
              return;
            }
          }
        }
      }

      // Draw Pipes
      const pipeWidth = 56;
      for (const pipe of pipesRef.current) {
        // Top Pipe
        const topGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
        topGrad.addColorStop(0, '#00558F');
        topGrad.addColorStop(0.4, '#0070BA');
        topGrad.addColorStop(1, '#003B70');
        ctx.fillStyle = topGrad;
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        // Top Pipe Cap
        ctx.fillStyle = '#004675';
        ctx.fillRect(pipe.x - 3, pipe.top - 18, pipeWidth + 6, 18);
        ctx.fillStyle = '#ED1C24';
        ctx.fillRect(pipe.x - 3, pipe.top - 4, pipeWidth + 6, 4);

        // Bottom Pipe
        const botY = groundY - pipe.bottom;
        const botGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
        botGrad.addColorStop(0, '#00558F');
        botGrad.addColorStop(0.4, '#0070BA');
        botGrad.addColorStop(1, '#003B70');
        ctx.fillStyle = botGrad;
        ctx.fillRect(pipe.x, botY, pipeWidth, pipe.bottom);
        // Bottom Pipe Cap
        ctx.fillStyle = '#004675';
        ctx.fillRect(pipe.x - 3, botY, pipeWidth + 6, 18);
        ctx.fillStyle = '#ED1C24';
        ctx.fillRect(pipe.x - 3, botY, pipeWidth + 6, 4);
      }

      // Draw Bird / Flying VietinBank Card Mascot
      ctx.save();
      ctx.translate(birdRef.current.x, birdRef.current.y);
      ctx.rotate(birdRef.current.rotation);

      // Card / Bird Body
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#ED1C24';
      ctx.beginPath();
      ctx.roundRect(-20, -14, 40, 28, 6);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Card chip
      ctx.fillStyle = '#FDB913';
      ctx.beginPath();
      ctx.roundRect(-14, -8, 10, 8, 2);
      ctx.fill();

      // Card text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('iPay', -14, 8);

      // Wing
      ctx.fillStyle = '#00558F';
      ctx.beginPath();
      ctx.ellipse(4, 2, 9, 6, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(14, -6, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(15, -6, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [endGame, winGame]);

  return (
    <div
      id="flappy-voucher-game"
      ref={containerRef}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden max-w-2xl mx-auto p-4 sm:p-6"
    >
      {/* Header controls & Score */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
            Game 1: Flappy Bird
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-900">{GAME_TITLE}</h3>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#00558F]" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress & Encouragement Bar during game */}
      <div className="py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-[#00558F] font-bold text-sm">
            Điểm: {score}/{WIN_SCORE}
          </div>
          <span className="text-xs font-semibold text-slate-700 animate-pulse">
            {getEncouragement(score)}
          </span>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Kỷ lục: <strong className="text-slate-900">{bestScore}/20</strong>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
        <div
          className="bg-gradient-to-r from-blue-600 to-red-600 h-full transition-all duration-200"
          style={{ width: `${Math.min(100, (score / WIN_SCORE) * 100)}%` }}
        />
      </div>

      {/* Canvas Game Stage */}
      <div
        onClick={() => {
          if (gameState === 'PLAYING') jump();
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          if (gameState === 'PLAYING') jump();
        }}
        className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden cursor-pointer select-none touch-none shadow-inner"
      >
        <canvas
          ref={canvasRef}
          width={480}
          height={340}
          className="w-full h-full object-cover"
        />

        {/* Start Overlay */}
        {gameState === 'START' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00558F] to-[#ED1C24] flex items-center justify-center shadow-lg">
              <Fuel className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <h4 className="text-xl sm:text-2xl font-black text-amber-300">{GAME_TITLE}</h4>
              <p className="text-sm text-slate-200 mt-1">
                Vượt qua 20 thử thách để nhận voucher 2 lít xăng
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ED1C24] to-[#D8232A] hover:brightness-110 text-white font-extrabold text-sm sm:text-base shadow-lg transition-transform active:scale-95 flex items-center space-x-2"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Bắt đầu chơi</span>
            </button>
            <p className="text-xs text-blue-200">
              Chạm màn hình hoặc nhấn phím Space để bay
            </p>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-white">
                Rất tiếc, bạn đã vượt qua {score}/{WIN_SCORE} thử thách
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Chỉ còn một chút nữa thôi, hãy thử lại nhé!
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetGame();
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center space-x-1.5 shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setGameState('START');
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs sm:text-sm"
              >
                Về màn hình chính
              </button>
            </div>
          </div>
        )}

        {/* Victory Screen */}
        {gameState === 'VICTORY' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#003B70]/95 to-[#001D38]/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center shadow-lg animate-bounce">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-amber-300">Chúc mừng!</h4>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-sm">
                Bạn đã vượt qua 20 thử thách và đủ điều kiện nhận voucher 2 lít xăng.
              </p>
            </div>

            {/* Voucher Box */}
            <div className="bg-white/10 border border-amber-300/40 rounded-2xl p-4 w-full max-w-xs space-y-2 backdrop-blur-md">
              <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                Mã nhận quà của Quý khách
              </div>
              <div className="text-2xl font-black tracking-widest text-white py-1 font-mono">
                {voucherCode}
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                Vui lòng chụp màn hình hoặc đưa mã này cho nhân viên để nhận quà.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyVoucherCode();
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center space-x-1 shadow-md"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã chép mã' : 'Sao chép mã'}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetGame();
                }}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs flex items-center space-x-1"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Latest Voucher Section (stored in localStorage) */}
      {latestVoucher && (
        <div className="mt-4 p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Fuel className="w-4 h-4 text-amber-700" />
            <div className="text-xs text-amber-900">
              <span>Mã gần nhất: </span>
              <strong className="font-mono text-sm font-bold text-red-600 ml-1">
                {latestVoucher}
              </strong>
              <span className="text-slate-500 ml-2">(Voucher 2 lít xăng)</span>
            </div>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(latestVoucher);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="text-xs text-[#00558F] font-bold hover:underline"
          >
            Chép mã
          </button>
        </div>
      )}
    </div>
  );
};
