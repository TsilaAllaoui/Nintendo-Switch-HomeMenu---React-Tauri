import "../styles/GameCardList.scss";
import GameCard from "./GameCard";

function GameCardList() {
  let gameList = [
    { title: "Mario Kart 8 - Deluxe", color: "red" },
    { title: "The Legend of Zelda - Breath of the Wild", color: "blue" },
    { title: "Splatoon 2", color: "yellow" },
    { title: "Pokemon Shield", color: "magenta" },
    { title: "Sonic Frontiers", color: "lightblue" },
    { title: "Sonic Frontiers", color: "lightblue" },
    { title: "Sonic Frontiers", color: "lightblue" },
    { title: "Sonic Frontiers", color: "lightblue" },
  ];

  return (
    <div id="game-card-list-container">
      {gameList.map((game) => (
        <GameCard title={game.title} color={game.color} key={game.title}/>
      ))}
    </div>
  );
}

export default GameCardList;
