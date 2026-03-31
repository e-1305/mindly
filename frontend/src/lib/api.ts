import axios from "axios";
import { useAuthStore } from "./store";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

// Check-in
export const submitCheckIn = (data: {
  mood: number;
  energy: number;
  stress: number;
  mentalLoad: number;
  note?: string;
}) => api.post("/checkin", data);

export const getMyCheckIns = () => api.get("/checkin/me");

// Manager
export const getTeamInsights = () => api.get("/insights/team");

export const getAIInsights = () => api.get("/insights/ai");

export default api;
