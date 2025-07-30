use crate::api::user_api;
use actix_web::web;

pub fn configure_user_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(user_api::get_users)
        .service(user_api::get_user_by_id)
        .service(user_api::get_user_by_username)
        .service(user_api::create_user)
        .service(user_api::update_user)
        .service(user_api::delete_user);
}
