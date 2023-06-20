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

  const [currentGame, setCurrentGame] = useState<HTMLDivElement | null>(null);

//   function scrollToElement(element: HTMLDivElement) {
//     var scrollableDiv = document.querySelector("#game-card-list-container");
//     const containerRect = scrollableDiv!.getBoundingClientRect();
//   const elementRect = element.getBoundingClientRect();

//   console.log("containerRect:" + containerRect.left + ":" + containerRect.right);
//   console.log("elementRect:" + elementRect.left + ":" + elementRect.right);

//   if (elementRect.right > containerRect.right) {
//     scrollableDiv!.scrollLeft += elementRect.right - containerRect.right;
//   }
//   }

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
    let cards: NodeListOf<HTMLDivElement> = document.querySelectorAll(".game-card");
    let currentGame: HTMLDivElement|null = cards[5];
    for (const element of cards) {
        if (element.style.border == "5px solid rgb(64, 206, 195)") {
            setCurrentGame(element);
            // scrollToElement(currentGame!);
            let rect = element.getBoundingClientRect();
            // console.log(rect.left + ":" + rect.right + "/" + rect.top + ":" + rect.bottom);
            const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            if (rect.left > screenWidth){
                console.log("overflow");
                element.scrollIntoView();
            }
            break;
        }
    }
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
