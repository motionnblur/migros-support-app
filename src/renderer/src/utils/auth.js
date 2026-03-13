export function buildErrorText(result) {
  if (!result) {
    return "Giriş başarısız";
  }

  const base = result.error || "Giriş başarısız";
  const code = result?.detail?.code || result?.detail?.cause?.code;
  const causeMessage = result?.detail?.cause?.message;

  if (!code && !causeMessage) {
    return base;
  }

  return `${base}${code ? ` (${code})` : ""}${causeMessage ? ` - ${causeMessage}` : ""}`;
}

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
}

function parseJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    return JSON.parse(decodeBase64Url(parts[1]));
  } catch {
    return null;
  }
}

export function isTokenValid(token) {
  if (!token) {
    return false;
  }

  const payload = parseJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") {
    return false;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp > nowInSeconds;
}

export function clearStoredAuth() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
