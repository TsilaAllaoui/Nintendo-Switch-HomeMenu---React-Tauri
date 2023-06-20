import "../styles/Buttons.scss";
import Button from "./Button";
import { BiMessageDetail } from "react-icons/bi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { TfiGallery } from "react-icons/tfi";
import { BsNintendoSwitch } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { FaPowerOff } from "react-icons/fa";

function Buttons() {
  let buttons = [
    { "label": "switch-online", "icon": <BiMessageDetail />, "color": "red"},
    { "label": "eshop", "icon": <HiOutlineShoppingBag />, "color": "orange"},
    { "label": "gallery", "icon": <TfiGallery />, "color": "blue"},
    { "label": "controller", "icon": <BsNintendoSwitch />, "color": "grey"},
    { "label": "settings","icon": <IoSettingsOutline />, "color": "grey"},
    { "label": "power-switch", "icon": <FaPowerOff />, "color": "grey"},
  ];

  return (
    <div id="buttons-container">
      {buttons.map((button) => (
          <Button key={button.label} button={button} />
      ))}
    </div>
  );
}

export default Buttons;
