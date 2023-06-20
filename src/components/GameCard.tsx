import "../styles/GameCard.scss";

function GameCard({
  title,
  color,
  active,
}: {
  title: string;
  color: string;
  active: boolean;
}) {
  return (
    <div className="game-card" style={{ animation: active ? "animGlox 1500ms infinite alternate" : "" }}>
      <div className="inner-container" style={{ backgroundColor: color }}>
        <p>{title}</p>
      </div>
    </div>
  );
}

export default GameCard;
