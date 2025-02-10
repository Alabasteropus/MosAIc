export const N8N_WEBHOOK_BASE_URL = "https://YOUR_N8N_ENDPOINT";

export const WEBHOOK_URLS = {
  insertMemory: `${N8N_WEBHOOK_BASE_URL}/insert-memory`,
  retrieveMemory: `${N8N_WEBHOOK_BASE_URL}/retrieve-memory`,
  updateMemory: `${N8N_WEBHOOK_BASE_URL}/update-memory`,
  buildPrompt: `${N8N_WEBHOOK_BASE_URL}/build-prompt`,
} as const;
