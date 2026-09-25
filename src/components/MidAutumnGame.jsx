import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Gamepad2, X } from 'lucide-react';
import GameHUD from './GameHUD';
import GameOverModal from './GameOverModal';
import GameStartModal from './GameStartModal';
import './midAutumnGame.css';
import {
  GAME_DURATION,
  clamp,
  createItem,
  getDifficulty,
  getStoredBest,
  intersectsBasket,
  storeBest,
} from './gameUtils';

const initialHud = { score: 0, lives: 3, timeLeft: GAME_DURATION, combo: 0 };

export default function MidAutumnGame() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [countdown, setCountdown] = useState(null);
  const [hud, setHud] = useState(initialHud);
  const [best, setBest] = useState(0);
  const [muted, setMuted] = useState(false);
  const [gameOver, setGameOver] = useState({ score: 0, best: 0, isNewBest: false, title: '' });
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const audioRef = useRef(null);
  const gameRef = useRef(null);
  const rafRef = useRef(0);
  const keysRef = useRef({ left: false, right: false });
  const reducedMotion = useMemo(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ), []);

  const playSound = useCallback((type) => {
    if (muted || typeof window === 'undefined') return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = audioRef.current || new AudioContext();
    audioRef.current = context;
    const now = context.currentTime;
    const osc = context.createOscillator();
    const gain = context.createGain();
    const tones = {
      mooncake: [520, 700, 0.1],
      lantern: [660, 920, 0.12],
      star: [880, 1240, 0.14],
      cloud: [180, 110, 0.18],
      over: [260, 170, 0.35],
    };
    const [from, to, length] = tones[type] || tones.mooncake;

    osc.type = type === 'cloud' || type === 'over' ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(from, now);
    osc.frequency.exponentialRampToValueAtTime(to, now + length);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(type === 'cloud' ? 0.08 : 0.12, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + length);
    osc.connect(gain).connect(context.destination);
    osc.start(now);
    osc.stop(now + length + 0.02);
  }, [muted]);

  const drawBackground = useCallback((ctx, width, height, t) => {
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#11072a');
    sky.addColorStop(0.55, '#201050');
    sky.addColorStop(1, '#0b071f');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.22;
    for (let i = 0; i < 46; i += 1) {
      const x = (i * 79) % width;
      const y = 26 + ((i * 47) % Math.max(120, height * 0.52));
      const pulse = reducedMotion ? 1 : 0.55 + Math.sin(t * 0.002 + i) * 0.35;
      ctx.fillStyle = '#fff7d4';
      ctx.beginPath();
      ctx.arc(x, y, 1.1 + (i % 3) * 0.6 * pulse, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    const moonX = width * 0.78;
    const moonY = height * 0.2;
    const moonR = Math.min(width, height) * 0.13;
    const glow = ctx.createRadialGradient(moonX, moonY, moonR * 0.2, moonX, moonY, moonR * 2.7);
    glow.addColorStop(0, 'rgba(255,225,141,.5)');
    glow.addColorStop(1, 'rgba(255,225,141,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR * 2.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffe7a3';
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(190,126,51,.13)';
    ctx.beginPath();
    ctx.arc(moonX - moonR * 0.32, moonY - moonR * 0.18, moonR * 0.14, 0, Math.PI * 2);
    ctx.arc(moonX + moonR * 0.2, moonY + moonR * 0.18, moonR * 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 3; i += 1) {
      const cx = ((t * 0.012 + i * width * 0.38) % (width + 180)) - 90;
      const cy = height * (0.18 + i * 0.14);
      drawCloudShape(ctx, cx, cy, 85 + i * 22, '#ffffff');
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#080515';
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, height - 54);
    for (let x = 0; x <= width; x += 90) {
      ctx.lineTo(x + 45, height - 92 - (x % 180) * 0.12);
      ctx.lineTo(x + 90, height - 54);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
  }, [reducedMotion]);

  const endGame = useCallback((score) => {
    const previousBest = getStoredBest();
    const nextBest = Math.max(previousBest, score);
    const isNewBest = score > previousBest;
    if (isNewBest) storeBest(score);
    setBest(nextBest);
    setGameOver({
      score,
      best: nextBest,
      isNewBest,
      title: score >= 800 ? 'Vua Hội Trăng Rằm' : score >= 500 ? 'Trăng Rằm Siêu Cấp 🌕' : '',
    });
    setPhase('over');
    playSound('over');
  }, [playSound]);

  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    gameRef.current = {
      startedAt: performance.now(),
      lastAt: performance.now(),
      lastSpawnAt: 0,
      score: 0,
      lives: 3,
      combo: 0,
      items: [],
      particles: [],
      floaters: [],
      shake: 0,
      lastHudAt: 0,
      basket: {
        x: rect.width / 2,
        y: rect.height - 54,
        targetX: rect.width / 2,
        width: clamp(rect.width * 0.16, 86, 126),
        height: 46,
        bounce: 0,
      },
    };
    setHud(initialHud);
  }, []);

  const startCountdown = useCallback(() => {
    resetGame();
    setPhase('countdown');
    const sequence = ['3', '2', '1', 'Go!'];
    let index = 0;
    setCountdown(sequence[index]);
    const timer = window.setInterval(() => {
      index += 1;
      if (index >= sequence.length) {
        window.clearInterval(timer);
        setCountdown(null);
        setPhase('playing');
        if (audioRef.current?.state === 'suspended') audioRef.current.resume();
      } else {
        setCountdown(sequence[index]);
      }
    }, 720);
  }, [resetGame]);

  const closeGame = useCallback(() => {
    setOpen(false);
    setPhase('idle');
    setCountdown(null);
    cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    setBest(getStoredBest());
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeGame();
      if (event.key === 'ArrowLeft') keysRef.current.left = true;
      if (event.key === 'ArrowRight') keysRef.current.right = true;
    };
    const onKeyUp = (event) => {
      if (event.key === 'ArrowLeft') keysRef.current.left = false;
      if (event.key === 'ArrowRight') keysRef.current.right = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [closeGame, open]);

  useEffect(() => {
    if (phase !== 'playing' || !gameRef.current) return;
    const now = performance.now();
    gameRef.current.startedAt = now;
    gameRef.current.lastAt = now;
    gameRef.current.lastSpawnAt = now;
  }, [phase]);

  useEffect(() => {
    if (!open) return undefined;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (gameRef.current) {
        gameRef.current.basket.y = rect.height - 54;
        gameRef.current.basket.width = clamp(rect.width * 0.16, 86, 126);
        gameRef.current.basket.x = clamp(gameRef.current.basket.x, gameRef.current.basket.width / 2, rect.width - gameRef.current.basket.width / 2);
        gameRef.current.basket.targetX = gameRef.current.basket.x;
      }
    };

    const moveBasket = (clientX) => {
      const rect = canvas.getBoundingClientRect();
      const game = gameRef.current;
      if (!game) return;
      game.basket.targetX = clamp(clientX - rect.left, game.basket.width / 2, rect.width - game.basket.width / 2);
    };
    const onPointerMove = (event) => moveBasket(event.clientX);
    const onTouchMove = (event) => {
      event.preventDefault();
      if (event.touches[0]) moveBasket(event.touches[0].clientX);
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('touchmove', onTouchMove);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');

    const tick = (now) => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const game = gameRef.current;
      drawBackground(ctx, width, height, now);

      if (phase !== 'playing' || !game) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const dt = Math.min((now - game.lastAt) / 1000, 0.035);
      game.lastAt = now;
      const elapsed = (now - game.startedAt) / 1000;
      const timeLeft = Math.max(0, GAME_DURATION - elapsed);
      const difficulty = getDifficulty(elapsed);

      if (keysRef.current.left) game.basket.targetX -= 480 * dt;
      if (keysRef.current.right) game.basket.targetX += 480 * dt;
      game.basket.targetX = clamp(game.basket.targetX, game.basket.width / 2, width - game.basket.width / 2);
      game.basket.x += (game.basket.targetX - game.basket.x) * (reducedMotion ? 1 : 0.24);
      game.basket.bounce = Math.max(0, game.basket.bounce - dt * 5);
      game.shake = Math.max(0, game.shake - dt * 10);

      if (now - game.lastSpawnAt > difficulty.spawnEvery) {
        game.items.push(createItem(width, elapsed));
        game.lastSpawnAt = now;
      }

      for (let i = game.items.length - 1; i >= 0; i -= 1) {
        const item = game.items[i];
        item.y += item.vy * dt;
        item.rotation += item.vr * dt;

        if (intersectsBasket(item, game.basket)) {
          game.items.splice(i, 1);
          if (item.type === 'cloud') {
            game.lives -= 1;
            game.combo = 0;
            game.shake = reducedMotion ? 0 : 1;
            pushFloater(game, '-1', item.x, game.basket.y - 26, '#9aa3bd');
            playSound('cloud');
          } else {
            const baseScore = item.type === 'star' ? 30 : item.type === 'lantern' ? 20 : 10;
            game.combo += 1;
            const bonus = game.combo >= 5 ? Math.round(baseScore * 0.5 + game.combo) : 0;
            game.score += baseScore + bonus;
            game.basket.bounce = reducedMotion ? 0 : 1;
            pushFloater(game, `+${baseScore + bonus}`, item.x, item.y, item.type === 'star' ? '#ffe783' : '#ffd08a');
            if (!reducedMotion) pushParticles(game, item.x, item.y, item.type, game.combo >= 5);
            playSound(item.type);
          }
        } else if (item.y - item.size > height) {
          if (item.type !== 'cloud') game.combo = 0;
          game.items.splice(i, 1);
        }
      }

      updateParticles(game, dt);
      const shakeX = game.shake ? (Math.random() - 0.5) * 8 * game.shake : 0;
      ctx.save();
      ctx.translate(shakeX, 0);
      game.items.forEach((item) => drawItem(ctx, item));
      drawBasket(ctx, game.basket, game.combo);
      game.particles.forEach((p) => drawParticle(ctx, p));
      game.floaters.forEach((p) => drawFloater(ctx, p));
      if (game.combo >= 5) drawCombo(ctx, width, height, game.combo);
      if (game.score >= 500) drawFireworks(ctx, width, height, now, game.score >= 800);
      ctx.restore();

      if (now - game.lastHudAt > 120 || game.lives <= 0 || timeLeft <= 0) {
        game.lastHudAt = now;
        setHud({
          score: game.score,
          lives: game.lives,
          timeLeft,
          combo: game.combo,
        });
      }

      if (game.lives <= 0 || timeLeft <= 0) {
        endGame(game.score);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawBackground, endGame, open, phase, playSound, reducedMotion]);

  return (
    <>
      <section className="section game-section" id="game">
        <div className="game-section-copy">
          <span className="section-kicker">MINI GAME ĐÊM RẰM</span>
          <h2>Thử tài đêm Trăng</h2>
          <p className="lead">Hứng thật nhiều bánh Trung Thu và đèn lồng trước khi thời gian kết thúc</p>
          <button className="btn btn-primary game-cta" type="button" aria-label="Choi ngay game Bat banh Trung Thu" onClick={() => setOpen(true)}>
            <Gamepad2 size={18} /> Chơi ngay
          </button>
        </div>
        <div className="game-preview" aria-hidden="true">
          <div className="preview-moon" />
          <div className="preview-lantern" />
          <div className="preview-basket" />
          <span className="preview-item one" />
          <span className="preview-item two" />
          <span className="preview-item three" />
        </div>
      </section>

      {open && (
        <div className="game-overlay" role="dialog" aria-modal="true" aria-label="Bat banh Trung Thu">
          <div className="game-shell">
            <div className="game-topbar">
              <h2>Bắt bánh Trung Thu</h2>
              <button className="game-close" type="button" aria-label="Dong game" onClick={closeGame}>
                <X size={20} />
              </button>
            </div>
            <GameHUD
              score={hud.score}
              best={best}
              timeLeft={hud.timeLeft}
              lives={hud.lives}
              muted={muted}
              onToggleSound={() => setMuted((value) => !value)}
            />
            <div className={`game-canvas-wrap ${hud.combo >= 5 ? 'combo-glow' : ''}`} ref={wrapRef}>
              <canvas ref={canvasRef} aria-label="Khu vuc choi Bat banh Trung Thu" />
              {(phase === 'idle' || phase === 'countdown') && (
                <GameStartModal countdown={countdown} onStart={startCountdown} onClose={closeGame} />
              )}
              {phase === 'over' && (
                <GameOverModal
                  score={gameOver.score}
                  best={gameOver.best}
                  isNewBest={gameOver.isNewBest}
                  title={gameOver.title}
                  onRestart={startCountdown}
                  onClose={closeGame}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function pushFloater(game, text, x, y, color) {
  game.floaters.push({ text, x, y, color, life: 1 });
}

function pushParticles(game, x, y, type, combo) {
  const count = combo ? 18 : 10;
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count;
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * (55 + Math.random() * 80),
      vy: Math.sin(angle) * (55 + Math.random() * 80),
      color: type === 'star' ? '#ffe783' : type === 'lantern' ? '#ff8c6a' : '#ffd08a',
      life: 0.7 + Math.random() * 0.4,
      size: combo ? 3 : 2,
    });
  }
}

function updateParticles(game, dt) {
  for (let i = game.particles.length - 1; i >= 0; i -= 1) {
    const p = game.particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 90 * dt;
    p.life -= dt;
    if (p.life <= 0) game.particles.splice(i, 1);
  }
  for (let i = game.floaters.length - 1; i >= 0; i -= 1) {
    const p = game.floaters[i];
    p.y -= 48 * dt;
    p.life -= dt;
    if (p.life <= 0) game.floaters.splice(i, 1);
  }
}

function drawCloudShape(ctx, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x - size * 0.25, y + size * 0.08, size * 0.22, 0, Math.PI * 2);
  ctx.arc(x, y - size * 0.02, size * 0.32, 0, Math.PI * 2);
  ctx.arc(x + size * 0.28, y + size * 0.08, size * 0.24, 0, Math.PI * 2);
  ctx.rect(x - size * 0.45, y + size * 0.05, size * 0.9, size * 0.22);
  ctx.fill();
}

function drawItem(ctx, item) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.rotation);
  if (item.type === 'mooncake') {
    ctx.fillStyle = '#b8662b';
    roundRect(ctx, -20, -20, 40, 40, 11);
    ctx.fill();
    ctx.strokeStyle = '#ffd08a';
    ctx.lineWidth = 3;
    ctx.strokeRect(-11, -11, 22, 22);
    ctx.fillStyle = '#ffe0a2';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
  } else if (item.type === 'lantern') {
    const gradient = ctx.createLinearGradient(-22, 0, 22, 0);
    gradient.addColorStop(0, '#b92e2f');
    gradient.addColorStop(0.5, '#ff735b');
    gradient.addColorStop(1, '#b92e2f');
    ctx.fillStyle = gradient;
    roundRect(ctx, -20, -25, 40, 50, 18);
    ctx.fill();
    ctx.strokeStyle = '#ffd46f';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#ffd46f';
    ctx.fillRect(-12, -32, 24, 7);
    ctx.fillRect(-1, 25, 2, 16);
  } else if (item.type === 'star') {
    ctx.fillStyle = '#ffd65f';
    drawStar(ctx, 0, 0, 5, 22, 9);
    ctx.fill();
    ctx.strokeStyle = '#fff0a8';
    ctx.stroke();
  } else {
    drawCloudShape(ctx, 0, 0, 54, '#4d5872');
    ctx.fillStyle = '#2d3449';
    ctx.globalAlpha = 0.8;
    drawCloudShape(ctx, 2, 3, 40, '#2d3449');
  }
  ctx.restore();
}

function drawBasket(ctx, basket, combo) {
  ctx.save();
  ctx.translate(basket.x, basket.y + Math.sin(basket.bounce * Math.PI) * -8);
  if (combo >= 5) {
    ctx.shadowBlur = 24;
    ctx.shadowColor = '#ffd46f';
  }
  const w = basket.width;
  const h = basket.height;
  const gradient = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
  gradient.addColorStop(0, '#a8322e');
  gradient.addColorStop(0.5, '#f0bc55');
  gradient.addColorStop(1, '#a8322e');
  ctx.fillStyle = gradient;
  roundRect(ctx, -w / 2, -h / 2, w, h, 12);
  ctx.fill();
  ctx.strokeStyle = '#ffe08d';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, -h / 2, w * 0.34, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(92,39,19,.35)';
  ctx.lineWidth = 2;
  for (let x = -w / 2 + 14; x < w / 2; x += 18) {
    ctx.beginPath();
    ctx.moveTo(x, -h / 2 + 8);
    ctx.lineTo(x + 10, h / 2 - 8);
    ctx.stroke();
  }
  ctx.restore();
}

function drawParticle(ctx, p) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, p.life);
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFloater(ctx, p) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, p.life);
  ctx.fillStyle = p.color;
  ctx.font = '800 18px "Be Vietnam Pro", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(p.text, p.x, p.y);
  ctx.restore();
}

function drawCombo(ctx, width, height, combo) {
  ctx.save();
  ctx.fillStyle = '#ffe08d';
  ctx.shadowBlur = 22;
  ctx.shadowColor = '#ffd46f';
  ctx.font = '800 30px "Be Vietnam Pro", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Combo x${Math.min(combo, 99)}!`, width / 2, height * 0.22);
  ctx.restore();
}

function drawFireworks(ctx, width, height, now, king) {
  const message = king ? 'Vua Hội Trăng Rằm' : 'Trăng Rằm Siêu Cấp';
  ctx.save();
  ctx.fillStyle = '#fff2b6';
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#ffd65f';
  ctx.font = `800 ${king ? 24 : 22}px "Be Vietnam Pro", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(message, width / 2, 62);
  for (let burst = 0; burst < 3; burst += 1) {
    const cx = width * (0.25 + burst * 0.25);
    const cy = height * 0.22 + Math.sin(now * 0.003 + burst) * 18;
    for (let i = 0; i < 12; i += 1) {
      const a = (Math.PI * 2 * i) / 12 + now * 0.001;
      const r = 18 + ((now * 0.04 + burst * 9) % 22);
      ctx.fillStyle = i % 2 ? '#ff7c62' : '#ffe783';
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i += 1) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;
    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}
