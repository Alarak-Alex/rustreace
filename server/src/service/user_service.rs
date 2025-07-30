use crate::model::{User, CreateUserRequest, UpdateUserRequest};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

#[derive(Clone)]
pub struct UserService {
    users: Arc<Mutex<HashMap<u32, User>>>,
    next_id: Arc<Mutex<u32>>,
}

impl UserService {
    pub fn new() -> Self {
        Self {
            users: Arc::new(Mutex::new(HashMap::new())),
            next_id: Arc::new(Mutex::new(1)),
        }
    }

    pub fn get_all_users(&self) -> Result<Vec<User>, String> {
        let users = self.users.lock().map_err(|_| "Failed to lock users")?;
        Ok(users.values().cloned().collect())
    }

    pub fn get_user_by_id(&self, id: u32) -> Result<Option<User>, String> {
        let users = self.users.lock().map_err(|_| "Failed to lock users")?;
        Ok(users.get(&id).cloned())
    }

    pub fn get_user_by_username(&self, username: &str) -> Result<Option<User>, String> {
        let users = self.users.lock().map_err(|_| "Failed to lock users")?;
        Ok(users.values().find(|user| user.username == username).cloned())
    }

    pub fn create_user(&self, request: CreateUserRequest) -> Result<User, String> {
        let mut users = self.users.lock().map_err(|_| "Failed to lock users")?;
        let mut next_id = self.next_id.lock().map_err(|_| "Failed to lock next_id")?;
        
        // 检查用户名是否已存在
        if users.values().any(|user| user.username == request.username) {
            return Err("Username already exists".to_string());
        }
        
        let id = *next_id;
        *next_id += 1;
        
        let user = User::new(id, request.username, request.email);
        users.insert(id, user.clone());
        
        Ok(user)
    }

    pub fn update_user(&self, id: u32, request: UpdateUserRequest) -> Result<Option<User>, String> {
        let mut users = self.users.lock().map_err(|_| "Failed to lock users")?;
        
        // 首先检查用户是否存在
        if !users.contains_key(&id) {
            return Ok(None);
        }
        
        // 如果要更新用户名，先检查是否冲突
        if let Some(ref username) = request.username {
            if users.values().any(|u| u.id != id && u.username == *username) {
                return Err("Username already exists".to_string());
            }
        }
        
        // 现在可以安全地更新用户
        if let Some(user) = users.get_mut(&id) {
            if let Some(username) = request.username {
                user.username = username;
            }
            if let Some(email) = request.email {
                user.email = email;
            }
            Ok(Some(user.clone()))
        } else {
            Ok(None)
        }
    }

    pub fn delete_user(&self, id: u32) -> Result<bool, String> {
        let mut users = self.users.lock().map_err(|_| "Failed to lock users")?;
        Ok(users.remove(&id).is_some())
    }
}

impl Default for UserService {
    fn default() -> Self {
        Self::new()
    }
}