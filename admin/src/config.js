const raw = import.meta.env.VITE_BACKEND_URL || "";

export const backendUrl = String(raw)
  .trim()
  .replace(/^['"]|['"]$/g, "")
  .replace(/\/+$/, "");

export const ADMIN_TOKEN_KEY = "adminToken";
