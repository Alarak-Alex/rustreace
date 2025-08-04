const API_BASE_URL = "http://127.0.0.1:3001/api";

// User API
export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
}

// Card API
export interface Card {
  id: number;
  title: string;
  content: string;
  status: "Todo" | "InProgress" | "Done";
  created_at: string;
  updated_at: string;
}

export interface CreateCardRequest {
  title: string;
  content: string;
  status?: "Todo" | "InProgress" | "Done";
}

export interface UpdateCardRequest {
  title?: string;
  content?: string;
  status?: "Todo" | "InProgress" | "Done";
}

// User API functions
export const userApi = {
  getAll: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },

  getById: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/id/${id}`);
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  },

  create: async (user: CreateUserRequest): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error("Failed to create user");
    return response.json();
  },

  update: async (id: number, user: UpdateUserRequest): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/id/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error("Failed to update user");
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users/id/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete user");
  },
};

// Card API functions
export const cardApi = {
  getAll: async (): Promise<Card[]> => {
    const response = await fetch(`${API_BASE_URL}/cards`);
    if (!response.ok) throw new Error("Failed to fetch cards");
    return response.json();
  },

  getById: async (id: number): Promise<Card> => {
    const response = await fetch(`${API_BASE_URL}/cards/id/${id}`);
    if (!response.ok) throw new Error("Failed to fetch card");
    return response.json();
  },

  create: async (card: CreateCardRequest): Promise<Card> => {
    const response = await fetch(`${API_BASE_URL}/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(card),
    });
    if (!response.ok) throw new Error("Failed to create card");
    return response.json();
  },

  update: async (id: number, card: UpdateCardRequest): Promise<Card> => {
    const response = await fetch(`${API_BASE_URL}/cards/id/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(card),
    });
    if (!response.ok) throw new Error("Failed to update card");
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/cards/id/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete card");
  },
};
