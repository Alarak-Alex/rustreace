use crate::model::{Card, CreateCardRequest, UpdateCardRequest, CardStatus};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

#[derive(Clone)]
pub struct CardService {
    cards: Arc<Mutex<HashMap<u32, Card>>>,
    next_id: Arc<Mutex<u32>>,
}

impl CardService {
    pub fn new() -> Self {
        Self {
            cards: Arc::new(Mutex::new(HashMap::new())),
            next_id: Arc::new(Mutex::new(1)),
        }
    }

    pub fn get_all_cards(&self) -> Result<Vec<Card>, String> {
        let cards = self.cards.lock().map_err(|_| "Failed to lock cards")?;
        Ok(cards.values().cloned().collect())
    }

    pub fn get_card_by_id(&self, id: u32) -> Result<Option<Card>, String> {
        let cards = self.cards.lock().map_err(|_| "Failed to lock cards")?;
        Ok(cards.get(&id).cloned())
    }

    pub fn get_cards_by_status(&self, status: CardStatus) -> Result<Vec<Card>, String> {
        let cards = self.cards.lock().map_err(|_| "Failed to lock cards")?;
        Ok(cards.values()
            .filter(|card| std::mem::discriminant(&card.status) == std::mem::discriminant(&status))
            .cloned()
            .collect())
    }

    pub fn create_card(&self, request: CreateCardRequest) -> Result<Card, String> {
        let mut cards = self.cards.lock().map_err(|_| "Failed to lock cards")?;
        let mut next_id = self.next_id.lock().map_err(|_| "Failed to lock next_id")?;
        
        // 检查标题是否已存在
        if cards.values().any(|card| card.title == request.title) {
            return Err("Card title already exists".to_string());
        }
        
        let id = *next_id;
        *next_id += 1;
        
        let card = Card::new(id, request.title, request.content, request.status);
        cards.insert(id, card.clone());
        
        Ok(card)
    }

    pub fn update_card(&self, id: u32, request: UpdateCardRequest) -> Result<Option<Card>, String> {
        let mut cards = self.cards.lock().map_err(|_| "Failed to lock cards")?;
        
        // 首先检查卡片是否存在
        if !cards.contains_key(&id) {
            return Ok(None);
        }
        
        // 如果要更新标题，先检查是否冲突
        if let Some(ref title) = request.title {
            if cards.values().any(|c| c.id != id && c.title == *title) {
                return Err("Card title already exists".to_string());
            }
        }
        
        // 现在可以安全地更新卡片
        if let Some(card) = cards.get_mut(&id) {
            card.update(request);
            Ok(Some(card.clone()))
        } else {
            Ok(None)
        }
    }

    pub fn delete_card(&self, id: u32) -> Result<bool, String> {
        let mut cards = self.cards.lock().map_err(|_| "Failed to lock cards")?;
        Ok(cards.remove(&id).is_some())
    }
}

impl Default for CardService {
    fn default() -> Self {
        Self::new()
    }
}