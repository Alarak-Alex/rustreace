pub mod user_router;
pub mod card_router;

pub use user_router::*;
pub use card_router::*;

use actix_web::web;

pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .configure(configure_user_routes)
            .configure(configure_card_routes)
    );
}
