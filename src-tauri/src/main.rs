// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Serialize;
use tauri::Manager;
use std::fs;
use std::process::Command;
use std::io::Read; 

#[derive(Serialize, Debug)]
struct Game {
    title: String,
    icon: Vec<u8>,
}

fn get_game_infos(input: String, roms_path: String) {

    // Safeguards
    if !std::path::Path::new("prod.keys").exists() {
        println!("Decryption keys not found! Add \"prod.keys\" with \"nstool.exe\"");
    }
    if !std::path::Path::new("nstool.exe").exists() {
        println!("\"nstool.exe\" not found!");
    }

    // Creating temporary directory
    let _ = fs::create_dir(format!("{}/tmp", roms_path));

    // Extract NSP/XCI
    println!("\t- Current Input: {}", input);
    Command::new("nstool.exe")
        .args(["-x", &format!("{}\\tmp", roms_path), &input])
        .output()
        .expect("Failed to extract rom file!");

    // Get CNMT Layout file name
    let mut cnmt_layout_filename = String::new();
    let mut files = fs::read_dir(format!("{}/tmp", roms_path)).unwrap();
    for file in files {
        let name = String::from(file.expect("File not found").file_name().to_string_lossy());
        if name.find(".cnmt.nca") != None {
            cnmt_layout_filename = String::from(name);
            break;
        }
    }


    // Extract CNMT Layout file
    let cnmt_layout_file = format!("{}\\tmp\\{}", roms_path, cnmt_layout_filename);
    let mut output = Command::new("nstool.exe")
        .args(["-x", &format!("{}\\tmp\\cnmt", roms_path), &cnmt_layout_file])
        .output()
        .expect("Failed to execute command");

    // Reading CNMT Layout file
    files = fs::read_dir(format!("{}\\tmp\\cnmt\\0", roms_path)).expect("tmp directory not found");
    for file in files {
        let name = file
            .expect("File not found")
            .file_name()
            .into_string()
            .expect("Conversion error");
        if name.find(".cnmt") != None {
            let n = format!("{}\\tmp\\cnmt\\0\\{}", roms_path, name);
            output = Command::new("nstool.exe")
                .args(["-x", &format!("{}\\tmp\\cnmt\\0", roms_path), &n])
                .output()
                .expect("Can't extract file");
            break;
        }
    }

    // Get Metadata filename
    let mut metadata_filename = String::new();
    let out = String::from_utf8_lossy(&output.stdout).to_string();
    let mut outs: Vec<&str> = out.split("\n").collect();
    for i in 1..outs.len() {
        if outs[i].find("Control") != None {
            let mut b: Vec<&str> = outs[i + 1].split(" ").collect();
            b = b.last().expect("Index error").split("\r").collect();
            metadata_filename = b.first().expect("Index error").to_string() + ".nca";
            break;
        }
    }

    // Extracting and reading metadata file
    Command::new("nstool.exe")
        .args([
            "-x",
            &format!("{}\\tmp\\metadata", roms_path),
            &format!("{}\\tmp\\{}", roms_path, metadata_filename),
        ])
        .output()
        .expect("Error extracting metadata");

    output = Command::new("nstool.exe")
        .args([format!("{}\\tmp\\metadata\\0\\control.nacp", roms_path)])
        .output()
        .expect("Error extracting metadata");

    let mut title = String::from_utf8_lossy(&output.stdout).to_string();
    outs = title.split("\n").collect();
    for out in outs {
        if out.find("Name") != None {
            title = String::from(out.split("       ").last().expect("Index error"));
            title = String::from(&title[0..title.len() - 1]);
            break;
        }
    }

    // Creating output file and copying icon
    let dir_name = title.replace(" ", "_").replace(":", "").to_string();
    fs::create_dir(format!("{}\\games\\{}", roms_path, dir_name)).expect("Error creating output for games");
    fs::write(
        format!("{}\\games\\{}\\{}.txt", roms_path, dir_name, dir_name),
        format!("Game Title Name:\n{}", title),
    )
    .expect("Can't write file");
    files = fs::read_dir(format!("{}\\tmp\\metadata\\0", roms_path)).expect("Folder not found");
    for file in files {
        let name = file
            .expect("File not found")
            .file_name()
            .into_string()
            .expect("Conversion error");
        if name.find(".dat") != None {
            fs::copy(
                format!("{}\\tmp\\metadata\\0\\{}", roms_path, name),
                format!("{}\\games\\{}\\{}.png", roms_path, dir_name, name),
            )
            .expect("Can't copy file");
            break;
        }
    }

    // Clearing temporary files
    let _ = fs::remove_dir_all(format!("{}\\tmp", roms_path));

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
        }

        else if parts[0] == "roms_path" && parts[1] == "" {
            panic!("Rom files path not found in config!");
        }
    }

    // Cleaning older temp files
    let _ = fs::remove_dir_all(format!("{}\\games", roms_path));
    let _ = fs::create_dir(format!("{}\\games", roms_path));
    let _ = fs::remove_dir_all(format!("{}\\tmp", roms_path));

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
            get_game_infos(path, roms_path.clone());
        }
    }

    let _ = fs::remove_file(format!("{}\\games\\games.json", roms_path));

    let mut games: Vec<Game> = Vec::new();
    let entries = fs::read_dir(format!("{}\\games", roms_path)).expect("Game folder not found");
    for file in entries {
        let name = file
            .expect("File name error")
            .file_name()
            .into_string()
            .expect("Conversion error");
        let file =
            fs::read_to_string(format!("{}\\games\\{}\\{}.txt", roms_path, name, name)).expect("File not fount");


        // Icon
        let p = format!(
            "{}/games/{}/icon_AmericanEnglish.dat.png",
            roms_path,
            name.replace("/", "\\"));
        let mut icon_file = fs::File::open(p).unwrap();
        let mut buf: Vec<u8> = vec![];
        let _ = icon_file.read_to_end(&mut buf);

        let parts: Vec<&str> = file.split("\n").collect();
        let game = Game {
            title: parts[1].to_string(),
            icon: buf
        };
        games.push(game);
    }
    let output = format!("{:#?}", games)
        .replace("Game", "")
        .replace("title:", "\"title\":")
        .replace("icon:", "\"icon\":")
        .replace("png\",", "png\"")
        .replace(",\n]", "\n]");
    let _ = fs::File::create(format!("{}\\games\\games.json", roms_path)).expect("Can't create file");
    let _ = fs::write(format!("{}\\games\\games.json", roms_path), output);

    println!("********** Extraction finished **********\n\n");
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
