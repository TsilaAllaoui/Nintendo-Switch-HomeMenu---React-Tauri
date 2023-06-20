import "../styles/Home.scss";
import { MdWifi } from "react-icons/md"; 
import { RiBatteryLowFill } from "react-icons/ri";
import Buttons from "./Buttons";
import GameCardList from "./GameCardList";
import icon from "../assets/icon.png";

function Home() {
    return <div id="home-root">
       <header>
        <div id="user" style={{backgroundImage: `url(${icon})`}}>
        </div>
        <div id="system-info">
            <p>12:39PM</p>
            <MdWifi id="wifi-icon"/>
            <p>77%</p>
            <RiBatteryLowFill id="battery-icon"/>
        </div>
       </header>
       <div id="body">
        <GameCardList/>
       </div>
       <footer>
        <Buttons/>
       </footer>
    </div>;
}

export default Home;