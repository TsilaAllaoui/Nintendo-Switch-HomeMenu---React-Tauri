import "../styles/Home.scss";
import { MdWifi, MdWifiOff } from "react-icons/md";
import {
  RiBatteryChargeFill,
  RiBatteryFill,
  RiBatteryLowFill,
} from "react-icons/ri";
import Buttons from "./Buttons";
import GameCardList from "./GameCardList";
import icon from "../assets/icon.png";
import { useEffect, useMemo, useState } from "react";
import { Game, NavButton } from "./types";
import { invoke } from "@tauri-apps/api";
import { useBattery, useNetworkState } from "react-use";
import { BatteryState } from "react-use/lib/useBattery";
import { IoGameControllerSharp } from "react-icons/io5";

let pass = false;

function Home() {
  const [currentTime, setCurrentTime] = useState<string>(Date());
  const _useBattery = useBattery();
  const newtorkState = useNetworkState();
  const navButtons: NavButton[] = [
    {
      button: "A",
      label: "Select",
    },
    {
      button: "B",
      label: "Cancel",
    },
  ];

  const battery = useMemo(() => {
    return _useBattery.isSupported && _useBattery.fetched
      ? (_useBattery as BatteryState)
      : null;
  }, [_useBattery]);

  useEffect(() => {
    setInterval(() => {
      setCurrentTime(Date());
    }, 1000);
  }, []);

  const [gameList, setGameList] = useState<Game[]>([]);

  useEffect(() => {
    if (!pass) {
      invoke("generate_json").then((data: any) => {
        setGameList(data);
      });
      pass = true;
    }
  }, [gameList]);

  const [splashscreenName, setSplashcreenName] = useState(
    "/Nintendo Switch Logo GIF.gif"
  );

  useEffect(() => {
    setInterval(() => {
      setSplashcreenName((splashscreenName) =>
        splashscreenName == "/Nintendo Switch Logo GIF.gif"
          ? "/Nintendo Switch Logo GIF - static.gif"
          : splashscreenName
      );
    }, 1000);

    setInterval(() => {
      setSplashcreenName((splashscreenName) =>
        splashscreenName == "/Nintendo Switch Logo GIF - static.gif"
          ? "/Nintendo Switch Logo GIF.gif"
          : splashscreenName
      );
    }, 8000);
  }, []);

  return (
    <div id="home-root">
      {gameList.length > 0 ? (
        <>
          <header>
            <div id="user" style={{ backgroundImage: `url(${icon})` }}></div>
            <div id="system-info">
              <p>{currentTime.split(" ")[4].substring(0, 5)}</p>
              {newtorkState.online ? (
                <MdWifi id="wifi-icon" />
              ) : (
                <MdWifiOff id="wifi-icon" />
              )}
              <p>{battery ? battery!.level * 100 : 100}%</p>
              {battery ? (
                battery!.charging ? (
                  <RiBatteryChargeFill id="battery-icon" />
                ) : battery!.level > 0.75 ? (
                  <RiBatteryFill id="battery-icon" />
                ) : (
                  <RiBatteryLowFill id="battery-icon" />
                )
              ) : (
                <RiBatteryChargeFill id="battery-icon" />
              )}
            </div>
          </header>
          <div id="body">
            <GameCardList gameList={gameList} />
          </div>
          <footer>
            <Buttons />
          </footer>
          <div id="separator"></div>
          <div id="bottom">
            <div id="controller">
              <div id="leds">
                <div
                  id="1p"
                  className="led"
                  style={{ backgroundColor: "rgb(45, 204, 45)" }}
                ></div>
                <div id="2p" className="led"></div>
                <div id="3p" className="led"></div>
                <div id="4p" className="led"></div>
              </div>
              <IoGameControllerSharp id="controller-icon" />
            </div>
            <div id="navigation-buttons">
              {navButtons.length > 0 &&
                navButtons.map((button) => {
                  return (
                    <div key={button.label}>
                      <div id="button-container">{button.button}</div>
                      {button.label}
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      ) : (
        <div id="splashscreen">
          <img src={splashscreenName} alt="" />
        </div>
      )}
    </div>
  );
}

export default Home;
