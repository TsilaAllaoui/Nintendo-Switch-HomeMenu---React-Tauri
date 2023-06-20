import { useEffect, useState } from "react";
import "../styles/GameCardList.scss";
import GameCard from "./GameCard";

function GameCardList() {
  let gameList = [
    { title: "Mario Kart 8 - Deluxe", color: "red" },
    { title: "The Legend of Zelda - Breath of the Wild", color: "blue" },
    { title: "Splatoon 2", color: "yellow" },
    { title: "Pokemon Shield", color: "magenta" },
    { title: "Sonic Frontiers", color: "lightblue" },
    { title: "Sonic Frontiers1", color: "lightblue" },
    { title: "Sonic Frontiers2", color: "lightblue" },
    { title: "Sonic Frontiers3", color: "lightblue" },
  ];

  const [currentHoveredGame, setCurrentHoveredGame] = useState(0);

  const containerOnKeydown = (e: KeyboardEvent) => {
    console.log(e.key);
    if (e.key == "ArrowLeft") {
      setCurrentHoveredGame((currentHoveredGame) => currentHoveredGame - (currentHoveredGame > 0 ? 1 : 0));
    } else if (
      e.key == "ArrowRight") {
      setCurrentHoveredGame(currentHoveredGame => currentHoveredGame + (currentHoveredGame < gameList.length ? 1 : 0));
    }
  };

  useEffect(() => {
    window.addEventListener("keyup", containerOnKeydown);
  }, [])

  useEffect(() => {
    console.log(currentHoveredGame);
  }, [currentHoveredGame]);

  return (
    <div id="game-card-list-container">
      {gameList.map((game, index) => (
        <GameCard title={game.title} color={game.color} key={game.title} active={index == currentHoveredGame}/>
      ))}
    </div>
  );
}

export default GameCardList;
