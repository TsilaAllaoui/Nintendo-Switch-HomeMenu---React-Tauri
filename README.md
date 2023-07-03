# 🎮 **SwitchHomeMenu-React-Tauri**

The **Nintendo Switch HorizonOS** home menu remade with **ReactJS + Typescript + Tauri + Rust***.

## **<u>Disclaimer</u>**
- **All right related to the Nintendo Switch and games are properties of Nintendo**
- you should **add your own owned prod.keys** 

## ✔️ **<u>Features</u>**
- [x] Show all games (NSP) specified path in config.cfg
- [x] Navigate between games in list
- [x] Real time system information displayed: time, connection status, battery file and state
- [x] Launch selected game using yuzu-cmd.exe specified in emu.cfg

## ⚓ **<u>Requirements for building</u>**
- Yarn and Tauri
- Rust installed
- nstool.exe, only the version forked in [my repo](https://github.com/TsilaAllaoui/nstool) work because i edited it manually to do what is necessary (should be already included in the release)
- prod.keys (needed to be placed at the same level as nsool.exe and the built binary)
- edit config.cfg and emu.cfg for paths

## 🛠️ **<u>Building</u>**
- Just run yarn tauri dev to test locally and debug or yarn tauri build to build binary file 

## 🎉 **<u>Credits</u>**
- [jakcron](https://github.com/jakcron) for his version of [nstool](https://github.com/jakcron/nstool) that i have forked 

## 📷 **<u>Screenshots</u>**

![pic1](./screenshots/picture.png)

## ⏰ **<u>Future features</u>**
- Add controller (xbox, joycons, pro controller) support
- Add user and HorizonOS settings navigation
