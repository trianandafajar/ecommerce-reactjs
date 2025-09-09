import { v4 as uuidv4 } from "uuid";

const SESSION_KEY = "anon_user_id";

export function getOrCreateAnonId(): string {
  let anonId = localStorage.getItem(SESSION_KEY);
  if (!anonId) {
    anonId = uuidv4();
    localStorage.setItem(SESSION_KEY, anonId);
  }
  return anonId;
}
