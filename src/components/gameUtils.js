export const GAME_DURATION = 60;
export const HIGH_SCORE_KEY = 'midAutumnHighScore';

export const ITEM_CONFIG = {
  mooncake: { label: 'Banh Trung Thu', score: 10, color: '#f0a94d' },
  lantern: { label: 'Den long', score: 20, color: '#ef4b3f' },
  star: { label: 'Ngoi sao vang', score: 30, color: '#ffd65f' },
  cloud: { label: 'May den', score: 0, color: '#56607a' },
};

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function getDifficulty(elapsed) {
  if (elapsed < 20) return { level: 'slow', spawnEvery: 920, fallSpeed: 130 };
  if (elapsed < 40) return { level: 'medium', spawnEvery: 680, fallSpeed: 185 };
  return { level: 'fast', spawnEvery: 470, fallSpeed: 250 };
}

export function getTimeLabel(secondsLeft) {
  const safe = Math.max(0, Math.ceil(secondsLeft));
  return `00:${String(safe).padStart(2, '0')}`;
}

export function getStoredBest() {
  if (typeof window === 'undefined') return 0;
  const value = Number(window.localStorage.getItem(HIGH_SCORE_KEY));
  return Number.isFinite(value) ? value : 0;
}

export function storeBest(score) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(HIGH_SCORE_KEY, String(score));
}

export function createItem(width, elapsed) {
  const roll = Math.random();
  const type = roll > 0.84 ? 'cloud' : roll > 0.68 ? 'star' : roll > 0.42 ? 'lantern' : 'mooncake';
  const difficulty = getDifficulty(elapsed);
  const size = type === 'cloud' ? 54 : type === 'lantern' ? 46 : 42;

  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    type,
    x: 36 + Math.random() * Math.max(1, width - 72),
    y: -70,
    size,
    vy: difficulty.fallSpeed + Math.random() * 55,
    rotation: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 1.8,
  };
}

export function intersectsBasket(item, basket) {
  const itemLeft = item.x - item.size / 2;
  const itemRight = item.x + item.size / 2;
  const itemBottom = item.y + item.size / 2;
  const basketLeft = basket.x - basket.width / 2;
  const basketRight = basket.x + basket.width / 2;
  const basketTop = basket.y - basket.height / 2;

  return itemRight > basketLeft && itemLeft < basketRight && itemBottom > basketTop;
}
