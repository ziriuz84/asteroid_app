// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod settings;
mod weather;

#[tauri::command]
fn get_weather_forecast() -> Result<String, String> {
    match weather::prepare_data() {
        Ok(forecast) => Ok(serde_json::to_string(&forecast).unwrap()),
        Err(e) => Err(format!("Errore nel recupero dei dati meteo: {}", e)),
    }
}

#[tauri::command]
fn get_lang() -> String {
    let settings = settings::Settings::new().unwrap();
    settings.get_lang().to_string()
}

#[tauri::command]
fn set_lang(lang: &str) {
    let mut settings = settings::Settings::new().unwrap();
    settings.set_lang(lang.to_string());
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, get_weather_forecast])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
