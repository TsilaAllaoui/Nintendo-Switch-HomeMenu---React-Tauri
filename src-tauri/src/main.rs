// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Serialize;
use std::fs;
use std::io::Read;
use std::process::Command;
use tauri::Manager;

#[derive(Serialize, Debug)]
struct Game {
    title: String,
    icon: Vec<u8>,
}

#[tauri::command]
async fn generate_json() -> Vec<Game> {
    // Checking config file
    let mut config_file = std::fs::File::open("config.cfg").expect("Config file not found!");
    let mut config_file_content = String::new();
    let _ = config_file.read_to_string(&mut config_file_content);

    // Reading rom files paths
    let mut roms_path = String::new();
    let parts: Vec<&str> = config_file_content.split("\n").collect();
    for part in parts {
        let parts: Vec<&str> = part.split(":\t").collect();
        if parts[0] == "roms_path" && parts[1] != "" {
            roms_path = parts[1].to_string().replace("\"", "").replace("/", "\\");
            println!(" - Rom path:\t- {}", roms_path);
        } else if parts[0] == "roms_path" && parts[1] == "" {
            panic!("Rom files path not found in config!");
        }
    }

    // Safeguards
    if !std::path::Path::new("prod.keys").exists() {
        println!("Decryption keys not found! Add \"prod.keys\" with \"nstool.exe\"");
    }
    if !std::path::Path::new("nstool.exe").exists() {
        println!("\"nstool.exe\" not found!");
    }

    // Cleaning temp folders and creating new ones
    let _ = fs::remove_dir_all("games");
    let _ = fs::create_dir("games");

    println!("\t********** Beginning extraction **********\n\n");

    // Iterating files, getting rom files then extract icon and infos
    let rom_files = fs::read_dir(format!("{}", roms_path)).expect("Error getting rom files");
    for file in rom_files {
        let path = file
            .expect("File not found")
            .path()
            .to_string_lossy()
            .to_string();
        if path.find(".nsp") != None {
            // != None || path.find(".xci") != None {
            // get_game_infos(path, roms_path.clone());
            println!("\t - {}", path);

            // Extracting game info
            Command::new("nstool.exe")
                .args([path])
                .output()
                .expect("Can't extract game info.");
        }
    }

    // List of games to return to frontend
    let mut games: Vec<Game> = Vec::new();

    // Reading games in specified folder
    let entries = fs::read_dir("games").expect("Game folder not found");
    for file in entries {
        let name = file
            .expect("File name error")
            .file_name()
            .into_string()
            .expect("Conversion error");
        let file =
            fs::read_to_string(format!("games\\{}\\title_info.txt", name)).expect("File not fount");

        // Icon
        let p = format!("games/{}/icon_AmericanEnglish.png", name);
        let mut icon_file = match fs::File::open(p) {
            Ok(val) => val,
            Err(e) => {
                println!("Error icon: {}", e);
                continue;
            }
        };
        let mut buf: Vec<u8> = vec![];
        let _ = icon_file.read_to_end(&mut buf);

        // Title
        let parts: Vec<&str> = file.split("\n").collect();
        let mut title_name = String::new();
        for part in parts {
            if part.find("title") != None {
                let parts: Vec<&str> = part.split("=").collect();
                title_name = parts[1].to_string();
            }
        }
        let game = Game {
            title: title_name,
            icon: buf,
        };
        games.push(game);
    }

    // Creating json file
    let output = format!("{:#?}", games)
        .replace("Game", "")
        .replace("title:", "\"title\":")
        .replace("icon:", "\"icon\":")
        .replace("png\",", "png\"")
        .replace(",\n]", "\n]");
    let _ = fs::File::create("games\\games.json").expect("Can't create file");
    let _ = fs::write("games\\games.json", output);

    println!("\n\n\t********** Extraction finished **********\n\n");
    games
}

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
                window.close_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![generate_json])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
