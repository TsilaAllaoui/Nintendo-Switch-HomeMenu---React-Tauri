import "../styles/GameCard.scss";

function GameCard({title, color} : {title: string, color: string}) {
    return <div className="game-card" style={{"backgroundColor": color}}>
        <p>{title}</p>
    </div>
}

export default GameCard;