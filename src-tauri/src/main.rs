// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod settings;
mod sun_moon_times;
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

#[tauri::command]
fn get_settings() -> settings::Settings {
    let settings = settings::Settings::new().unwrap();
    settings.get_all_settings()
}

#[tauri::command]
fn set_settings(settings: settings::Settings) {
    let mut settings_object = settings::Settings::new().unwrap();
    settings_object.set_settings(settings);
}

#[tauri::command]
fn get_sun_times() -> String {
    sun_moon_times::get_sun_moon_times()
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_weather_forecast,
            get_lang,
            set_lang,
            get_settings,
            set_settings,
            get_sun_times
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
