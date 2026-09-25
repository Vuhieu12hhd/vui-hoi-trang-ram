export default function GameStartModal({ countdown, onStart, onClose }) {
  const isCounting = countdown !== null;

  return (
    <div className="game-center-card" role="dialog" aria-modal="true" aria-labelledby="game-start-title">
      <span className="game-card-kicker">Mini game Trung Thu</span>
      <h3 id="game-start-title">Bắt bánh Trung Thu</h3>
      <p>Hứng thật nhiều bánh và đèn lồng trong 60 giây</p>
      {isCounting ? (
        <div className="countdown-pop" aria-live="polite">{countdown}</div>
      ) : (
        <div className="game-card-actions">
          <button className="btn btn-primary" type="button" aria-label="Bat dau game Bat banh Trung Thu" onClick={onStart}>
            Bắt đầu
          </button>
          <button className="btn btn-ghost" type="button" aria-label="Dong game" onClick={onClose}>
            Về lễ hội
          </button>
        </div>
      )}
    </div>
  );
}
