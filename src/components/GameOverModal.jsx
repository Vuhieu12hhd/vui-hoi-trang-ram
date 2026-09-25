export default function GameOverModal({ score, best, isNewBest, title, onRestart, onClose }) {
  return (
    <div className="game-center-card" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
      <span className="game-card-kicker">{title || 'Đêm Trăng kết thúc!'}</span>
      <h3 id="game-over-title">Đêm Trăng kết thúc!</h3>
      {isNewBest && <div className="new-best">🎉 Kỷ lục mới!</div>}
      <div className="score-summary">
        <span>Điểm của bạn</span>
        <strong>{score}</strong>
      </div>
      <div className="score-summary small">
        <span>Kỷ lục</span>
        <strong>{best}</strong>
      </div>
      <div className="game-card-actions">
        <button className="btn btn-primary" type="button" aria-label="Choi lai" onClick={onRestart}>
          Chơi lại
        </button>
        <button className="btn btn-ghost" type="button" aria-label="Ve le hoi" onClick={onClose}>
          Về lễ hội
        </button>
      </div>
    </div>
  );
}
