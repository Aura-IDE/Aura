// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use discord_rpc_client::{Client, Event};

fn main() {
    let state_message = env::args().nth(1).unwrap_or_else(|| String::from("Editing: index.js"));
    let mut drpc = Client::new(1221435094921777222);

    drpc.on_event(Event::Ready, |_ctx| {
        println!("Discord RPC: READY");
    });

    drpc.start();

    drpc.set_activity(|act| act.state(state_message))
        .expect("Failed to set activity");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}