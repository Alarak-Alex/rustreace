use crate::model::{CreateUserRequest, UpdateUserRequest};
use crate::service::UserService;
use actix_web::{HttpResponse, Result, delete, get, post, put, web};

// 获取所有用户
#[get("")]
pub async fn get_users(user_service: web::Data<UserService>) -> Result<HttpResponse> {
    match user_service.get_all_users() {
        Ok(users) => Ok(HttpResponse::Ok().json(users)),
        Err(err) => Ok(HttpResponse::InternalServerError().json(format!("Error: {err}"))),
    }
}

// 根据ID获取用户
#[get("/id/{id}")]
pub async fn get_user_by_id(
    path: web::Path<u32>,
    user_service: web::Data<UserService>,
) -> Result<HttpResponse> {
    let user_id = path.into_inner();

    match user_service.get_user_by_id(user_id) {
        Ok(Some(user)) => Ok(HttpResponse::Ok().json(user)),
        Ok(None) => Ok(HttpResponse::NotFound().json("User not found")),
        Err(err) => Ok(HttpResponse::InternalServerError().json(format!("Error: {err}"))),
    }
}

// 根据用户名获取用户
#[get("/username/{username}")]
pub async fn get_user_by_username(
    path: web::Path<String>,
    user_service: web::Data<UserService>,
) -> Result<HttpResponse> {
    let username = path.into_inner();

    match user_service.get_user_by_username(&username) {
        Ok(Some(user)) => Ok(HttpResponse::Ok().json(user)),
        Ok(None) => Ok(HttpResponse::NotFound().json("User not found")),
        Err(err) => Ok(HttpResponse::InternalServerError().json(format!("Error: {err}"))),
    }
}

// 创建用户
#[post("create")]
pub async fn create_user(
    request: web::Json<CreateUserRequest>,
    user_service: web::Data<UserService>,
) -> Result<HttpResponse> {
    match user_service.create_user(request.into_inner()) {
        Ok(user) => Ok(HttpResponse::Created().json(user)),
        Err(err) => Ok(HttpResponse::BadRequest().json(format!("Error: {err}"))),
    }
}

// 更新用户
#[put("/id/{id}")]
pub async fn update_user(
    path: web::Path<u32>,
    request: web::Json<UpdateUserRequest>,
    user_service: web::Data<UserService>,
) -> Result<HttpResponse> {
    let user_id = path.into_inner();

    match user_service.update_user(user_id, request.into_inner()) {
        Ok(Some(user)) => Ok(HttpResponse::Ok().json(user)),
        Ok(None) => Ok(HttpResponse::NotFound().json("User not found")),
        Err(err) => Ok(HttpResponse::BadRequest().json(format!("Error: {err}"))),
    }
}

// 删除用户
#[delete("/id/{id}")]
pub async fn delete_user(
    path: web::Path<u32>,
    user_service: web::Data<UserService>,
) -> Result<HttpResponse> {
    let user_id = path.into_inner();

    match user_service.delete_user(user_id) {
        Ok(true) => Ok(HttpResponse::Ok().json("User deleted successfully")),
        Ok(false) => Ok(HttpResponse::NotFound().json("User not found")),
        Err(err) => Ok(HttpResponse::InternalServerError().json(format!("Error: {err}"))),
    }
}
