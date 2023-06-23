import "../styles/Home.scss";
import { MdWifi } from "react-icons/md";
import { RiBatteryLowFill } from "react-icons/ri";
import Buttons from "./Buttons";
import GameCardList from "./GameCardList";
import icon from "../assets/icon.png";
import { useEffect, useState } from "react";
import Game from "./types";
import { invoke } from "@tauri-apps/api";

let pass = false;

function Home() {
  const [currentTime, setCurrentTime] = useState<string>(Date());

  useEffect(() => {
    setInterval(() => {
      setCurrentTime(Date());
    }, 1000);
  }, []);

  const [gameList, setGameList] = useState<Game[]>([]);

  useEffect(() => {
    if (!pass) {
      console.log("TAY");
      invoke("generate_json").then((data: any) => {
        setGameList(data);
        console.log(data);
      });
      console.log("TAY2");
      pass = true;
    }
  }, [gameList]);

  const [splashscreenName, setSplashcreenName] = useState("/Nintendo Switch Logo GIF.gif");

  useEffect(() => {
    setInterval(() => {
        setSplashcreenName( splashscreenName => splashscreenName == "/Nintendo Switch Logo GIF.gif" ? "/Nintendo Switch Logo GIF - static.gif": splashscreenName);
    }, 500);

    setInterval(() => {
      setSplashcreenName( splashscreenName => splashscreenName == "/Nintendo Switch Logo GIF - static.gif" ? "/Nintendo Switch Logo GIF.gif": splashscreenName);
    }, 8000);
  },[]);
  

  return (
    <div id="home-root">
      {
        gameList.length > 0 ?
        <>
          <header>
            <div id="user" style={{ backgroundImage: `url(${icon})` }}></div>
            <div id="system-info">
              <p>{currentTime.split(" ")[4]}</p>
              <MdWifi id="wifi-icon" />
              <p>77%</p>
              <RiBatteryLowFill id="battery-icon" />
            </div>
          </header>
          <div id="body">
            <GameCardList gameList={gameList} />
          </div>
          <footer>
            <Buttons />
          </footer>
        </>
        :
        <div id="splashscreen">
          <img src={splashscreenName} alt="" />
        </div>
      }
    </div>
  );
}

export default Home;
