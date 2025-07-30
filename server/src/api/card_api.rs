use crate::model::{CreateCardRequest, UpdateCardRequest, CardStatus};
use crate::service::CardService;
use actix_web::{HttpResponse, Result, delete, get, post, put, web};

// 获取所有卡片
#[get("")]
pub async fn get_cards(card_service: web::Data<CardService>) -> Result<HttpResponse> {
    match card_service.get_all_cards() {
        Ok(cards) => Ok(HttpResponse::Ok().json(cards)),
        Err(err) => Ok(HttpResponse::InternalServerError().json(format!("Error: {err}"))),
    }
}

// 根据ID获取卡片
#[get("/id/{id}")]
pub async fn get_card_by_id(
    path: web::Path<u32>,
    card_service: web::Data<CardService>,
) -> Result<HttpResponse> {
    let card_id = path.into_inner();

    match card_service.get_card_by_id(card_id) {
        Ok(Some(card)) => Ok(HttpResponse::Ok().json(card)),
        Ok(None) => Ok(HttpResponse::NotFound().json("Card not found")),
        Err(err) => Ok(HttpResponse::InternalServerError().json(format!("Error: {err}"))),
    }
}

// 根据状态获取卡片
#[get("/status/{status}")]
pub async fn get_cards_by_status(
    path: web::Path<String>,
    card_service: web::Data<CardService>,
) -> Result<HttpResponse> {
    let status_str = path.into_inner();
    
    let status = match status_str.to_lowercase().as_str() {
        "todo" => CardStatus::Todo,
        "inprogress" | "in_progress" => CardStatus::InProgress,
        "done" => CardStatus::Done,
        _ => return Ok(HttpResponse::BadRequest().json("Invalid status. Use: todo, inprogress, done")),
    };

    match card_service.get_cards_by_status(status) {
        Ok(cards) => Ok(HttpResponse::Ok().json(cards)),
        Err(err) => Ok(HttpResponse::InternalServerError().json(format!("Error: {err}"))),
    }
}

// 创建卡片
#[post("")]
pub async fn create_card(
    request: web::Json<CreateCardRequest>,
    card_service: web::Data<CardService>,
) -> Result<HttpResponse> {
    match card_service.create_card(request.into_inner()) {
        Ok(card) => Ok(HttpResponse::Created().json(card)),
        Err(err) => Ok(HttpResponse::BadRequest().json(format!("Error: {err}"))),
    }
}

// 更新卡片
#[put("/id/{id}")]
pub async fn update_card(
    path: web::Path<u32>,
    request: web::Json<UpdateCardRequest>,
    card_service: web::Data<CardService>,
) -> Result<HttpResponse> {
    let card_id = path.into_inner();

    match card_service.update_card(card_id, request.into_inner()) {
        Ok(Some(card)) => Ok(HttpResponse::Ok().json(card)),
        Ok(None) => Ok(HttpResponse::NotFound().json("Card not found")),
        Err(err) => Ok(HttpResponse::BadRequest().json(format!("Error: {err}"))),
    }
}

// 删除卡片
#[delete("/id/{id}")]
pub async fn delete_card(
    path: web::Path<u32>,
    card_service: web::Data<CardService>,
) -> Result<HttpResponse> {
    let card_id = path.into_inner();

    match card_service.delete_card(card_id) {
        Ok(true) => Ok(HttpResponse::Ok().json("Card deleted successfully")),
        Ok(false) => Ok(HttpResponse::NotFound().json("Card not found")),
        Err(err) => Ok(HttpResponse::InternalServerError().json(format!("Error: {err}"))),
    }
}