use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Card {
    pub id: u32,
    pub title: String,
    pub content: String,
    pub status: CardStatus,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub enum CardStatus {
    #[default]
    Todo,
    InProgress,
    Done,
}

#[derive(Debug, Deserialize)]
pub struct CreateCardRequest {
    pub title: String,
    pub content: String,
    pub status: Option<CardStatus>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateCardRequest {
    pub title: Option<String>,
    pub content: Option<String>,
    pub status: Option<CardStatus>,
}

impl Card {
    pub fn new(id: u32, title: String, content: String, status: Option<CardStatus>) -> Self {
        let now = chrono::Utc::now().to_rfc3339();
        Self {
            id,
            title,
            content,
            status: status.unwrap_or(CardStatus::Todo),
            created_at: now.clone(),
            updated_at: now,
        }
    }

    pub fn update(&mut self, request: UpdateCardRequest) {
        if let Some(title) = request.title {
            self.title = title;
        }
        if let Some(content) = request.content {
            self.content = content;
        }
        if let Some(status) = request.status {
            self.status = status;
        }
        self.updated_at = chrono::Utc::now().to_rfc3339();
    }
}
