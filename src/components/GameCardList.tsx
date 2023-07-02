import { useEffect, useState } from "react";
import "../styles/GameCardList.scss";
import GameCard from "./GameCard";
import { Game } from "./types";
import { invoke } from "@tauri-apps/api/tauri";

function GameCardList({ gameList }: {
  gameList: Game[]
}) {
  const [currentHoveredGame, setCurrentHoveredGame] = useState(0);

  const containerOnKeydown = async (e: KeyboardEvent) => {

    let cards: NodeListOf<HTMLDivElement> =
      document.querySelectorAll(".game-card");
    for (const element of cards) {
      if (element.matches(":hover")) {
        return;
      }
    }

    if (e.key == "ArrowLeft") {
      setCurrentHoveredGame(
        (currentHoveredGame) => currentHoveredGame - (currentHoveredGame > 0 ? 1 : 0)
      );
    } else if (e.key == "ArrowRight") {
      setCurrentHoveredGame(
        (currentHoveredGame) => currentHoveredGame + (currentHoveredGame < gameList.length - 1 ? 1 : 0)
      );
    }

    else if (e.key == "Enter") {
      invoke("launch_game", { path: localStorage.getItem("path") }).then(() => console.log("yuzu launched!"));
    }
  };

  const mouseClick = async () => {
    let cards: NodeListOf<HTMLDivElement> =
      document.querySelectorAll(".game-card");
    let index = 0;
    for (const element of cards) {
      if (element.matches(":hover")) {
        localStorage.setItem("path", gameList[index].path);
        invoke("launch_game", { path: localStorage.getItem("path") }).then(() => console.log("yuzu launched!"));
      }
      index++;
    }
  }

  useEffect(() => {
    let cards: NodeListOf<HTMLDivElement> =
      document.querySelectorAll(".game-card");
    let index = 0;
    for (const element of cards) {
      console.log(currentHoveredGame);
      if (element.style.border == "6px solid rgb(64, 206, 195)") {
        localStorage.setItem("path", gameList[index].path);
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
      index++;
    }
  }, [currentHoveredGame]);
  useEffect(() => {
    window.addEventListener("keyup", containerOnKeydown);
    window.addEventListener("click", mouseClick);
    localStorage.setItem("path", gameList[0].path);
  }, []);

  return (
    <div id="game-card-list-container">
      {gameList ? (
        gameList.map((game, index) => (
          <GameCard
            title={game.title}
            icon={game.icon}
            key={game.title + index}
            active={index == currentHoveredGame}
            index={index}
            set={setCurrentHoveredGame}
          />
        ))
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
}

export default GameCardList;
