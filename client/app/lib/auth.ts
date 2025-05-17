// lib/auth.ts or utils/auth.ts

const BASE_URL = "http://localhost:5000/api/auth";

interface AuthResponse {
  token: string;
  user: { id: string; username: string };
}

interface RegisterData {
  username: string;
  password: string;
}

interface LoginData {
  username: string;
  password: string;
}

async function registerUser(data: RegisterData): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Registration failed");
  }

  return res.json();
}

async function loginUser(data: LoginData): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Login failed");
  }

  return res.json();
}

// Optional: Token management helpers

function saveToken(token: string) {
  localStorage.setItem("authToken", token);
}

function getToken() {
  return localStorage.getItem("authToken");
}

function removeToken() {
  localStorage.removeItem("authToken");
}

export { registerUser, loginUser, saveToken, getToken, removeToken };
