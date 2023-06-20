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
    <div className="game-card"  style={{"border": `solid ${active ? "rgb(64,206,195)" : "#2d2d2d"} 5px`}}>
      <div className="inner-container" style={{ backgroundColor: color }}>
        <p>{title}</p>
      </div>
    </div>
  );
}

export default GameCard;
