import { useEffect, useState } from "react";
import "../styles/GameCardList.scss";
import GameCard from "./GameCard";
import Game from "./types";

function GameCardList({gameList}: {gameList: Game[]}) {
  const [currentHoveredGame, setCurrentHoveredGame] = useState(0);

  const containerOnKeydown = (e: KeyboardEvent) => {
    if (e.key == "ArrowLeft") {
      setCurrentHoveredGame(
        (currentHoveredGame) =>
          currentHoveredGame - (currentHoveredGame > 0 ? 1 : 0)
      );
    } else if (e.key == "ArrowRight") {
      setCurrentHoveredGame(
        (currentHoveredGame) =>
          currentHoveredGame + (currentHoveredGame < gameList.length ? 1 : 0)
      );
    }
  };

  useEffect(() => {
    let cards: NodeListOf<HTMLDivElement> =
      document.querySelectorAll(".game-card");
    for (const element of cards) {
      if (element.style.border == "5px solid rgb(64, 206, 195)") {
        let rect = element.getBoundingClientRect();
        const screenWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
        if (rect.left + rect.width > screenWidth) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        if (rect.left < 0) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        break;
      }
    }
  }, [currentHoveredGame]);
  useEffect(() => {
    window.addEventListener("keyup", containerOnKeydown);
  }, []);
  

  return (
    <div id="game-card-list-container">
      {gameList ? gameList.map((game, index) => (
        <GameCard
          title={game.title}
          icon={game.icon}
          key={game.title}
          active={index == currentHoveredGame}
        />
      )) : <p>Loading</p>}
    </div>
  );
}

export default GameCardList;
