use actix_web::{App, HttpServer, middleware::Logger, web};

mod api;
mod model;
mod router;
mod service;

use chrono::Local;
use log::info;
use router::configure_routes;
use service::{CardService, UserService};
use std::io::Write;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // 初始化日志
    init_logger();

    // 创建服务实例
    let user_service = UserService::new();
    let card_service = CardService::new();

    println!("🚀 Server starting on http://127.0.0.1:3001");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(user_service.clone()))
            .app_data(web::Data::new(card_service.clone()))
            .wrap(Logger::default())
            .configure(configure_routes)
            .route(
                "/",
                web::get().to(|| async { "Welcome to Rust React API Server!" }),
            )
            .route("/health", web::get().to(|| async { "OK" }))
    })
    .bind("127.0.0.1:3001")?
    .run()
    .await
}

fn init_logger() {
    use env_logger::Env;
    use env_logger::fmt::Color;
    use log::LevelFilter;

    let env = Env::default().filter_or("MY_LOG_LEVEL", "debug");
    // 设置日志打印格式
    env_logger::Builder::from_env(env)
        .format(|buf, record| {
            let level_color = match record.level() {
                log::Level::Error => Color::Red,
                log::Level::Warn => Color::Yellow,
                log::Level::Info => Color::Green,
                log::Level::Debug | log::Level::Trace => Color::Cyan,
            };

            let mut level_style = buf.style();
            level_style.set_color(level_color).set_bold(true);

            let mut style = buf.style();
            style.set_color(Color::White).set_dimmed(true);

            writeln!(
                buf,
                "{} {} [ {} ] {}",
                Local::now().format("%Y-%m-%d %H:%M:%S"),
                level_style.value(record.level()),
                style.value(record.module_path().unwrap_or("<unnamed>")),
                record.args()
            )
        })
        .filter(None, LevelFilter::Debug)
        .init();
    info!("env_logger initialized.");
}
