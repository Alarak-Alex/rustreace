use actix_web::{App, HttpServer, middleware::Logger, web};

mod api;
mod model;
mod router;
mod service;

use router::configure_user_routes;
use service::UserService;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // 初始化日志
    env_logger::init();

    // 创建用户服务实例
    let user_service = UserService::new();

    println!("🚀 Server starting on http://127.0.0.1:3001");
    
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(user_service.clone()))
            .wrap(Logger::default())
            .configure(configure_user_routes)
            .route("/", web::get().to(|| async { "Welcome to Rust React API Server!" }))
            .route("/health", web::get().to(|| async { "OK" }))
    })
    .bind("127.0.0.1:3001")?
    .run()
    .await
}
