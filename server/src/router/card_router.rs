use crate::api::card_api;
use actix_web::web;

pub fn configure_card_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/cards")
            .service(card_api::get_cards)
            .service(card_api::get_card_by_id)
            .service(card_api::get_cards_by_status)
            .service(card_api::create_card)
            .service(card_api::update_card)
            .service(card_api::delete_card),
    );
}