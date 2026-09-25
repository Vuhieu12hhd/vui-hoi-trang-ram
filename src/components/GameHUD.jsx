import { Heart, Trophy, Volume2, VolumeX } from 'lucide-react';
import { getTimeLabel } from './gameUtils';

export default function GameHUD({ score, best, timeLeft, lives, muted, onToggleSound }) {
  return (
    <div className="game-hud" aria-label="Thong tin van choi">
      <div className="hud-pill"><span>Score</span><strong>{score}</strong></div>
      <div className="hud-pill"><Trophy size={16} /><span>Best</span><strong>{best}</strong></div>
      <div className="hud-pill"><span>Time</span><strong>{getTimeLabel(timeLeft)}</strong></div>
      <div className="hud-hearts" aria-label={`${lives} mang con lai`}>
        {Array.from({ length: 3 }, (_, index) => (
          <Heart key={index} className={index >= lives ? 'lost' : ''} size={20} fill="currentColor" />
        ))}
      </div>
      <button
        className="sound-toggle"
        type="button"
        aria-label={muted ? 'Bat am thanh' : 'Tat am thanh'}
        onClick={onToggleSound}
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  );
}
