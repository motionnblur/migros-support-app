import { app, BrowserWindow, ipcMain } from "electron";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SUPPORT_API_BASE_URL = process.env.SUPPORT_API_BASE_URL || "http://127.0.0.1:3000";
const LOGIN_API_URL = `${SUPPORT_API_BASE_URL}/auth/login`;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1100,
    height: 720,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js")
    },
    autoHideMenuBar: true
  });

  const devServerUrl = process.env.ELECTRON_RENDERER_URL || process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    win.loadURL(devServerUrl);
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  }
};

async function requestSupportApi({ path, method = "GET", token, body }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const headers = {
      "Content-Type": "application/json"
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${SUPPORT_API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: data?.message || "Request failed",
        detail: data
      };
    }

    return {
      ok: true,
      status: response.status,
      data
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : "Unable to reach server"
    };
  } finally {
    clearTimeout(timeout);
  }
}

ipcMain.handle("auth:login", async (_event, credentials) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(LOGIN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials),
      signal: controller.signal
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: data?.message || "Login failed"
      };
    }

    return {
      ok: true,
      data
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : "Unable to reach server"
    };
  } finally {
    clearTimeout(timeout);
  }
});

ipcMain.handle("support:get-conversations", async (_event, payload) => {
  return requestSupportApi({
    path: "/support/conversations",
    method: "GET",
    token: payload?.token
  });
});

ipcMain.handle("support:search-customers", async (_event, payload) => {
  const query = typeof payload?.query === "string" ? payload.query.trim() : "";
  const limit = Math.min(Math.max(Number(payload?.limit) || 20, 1), 100);
  const searchParams = new URLSearchParams();

  if (query) {
    searchParams.set("query", query);
  }

  searchParams.set("limit", String(limit));

  return requestSupportApi({
    path: `/support/customers?${searchParams.toString()}`,
    method: "GET",
    token: payload?.token
  });
});

ipcMain.handle("support:get-messages", async (_event, payload) => {
  const conversationId = payload?.conversationId;
  if (!conversationId) {
    return {
      ok: false,
      status: 400,
      error: "conversationId is required"
    };
  }

  return requestSupportApi({
    path: `/support/conversations/${encodeURIComponent(conversationId)}/messages`,
    method: "GET",
    token: payload?.token
  });
});

ipcMain.handle("support:send-message", async (_event, payload) => {
  const conversationId = payload?.conversationId;
  if (!conversationId) {
    return {
      ok: false,
      status: 400,
      error: "conversationId is required"
    };
  }

  return requestSupportApi({
    path: `/support/conversations/${encodeURIComponent(conversationId)}/messages`,
    method: "POST",
    token: payload?.token,
    body: {
      text: payload?.text
    }
  });
});

ipcMain.handle("support:edit-message", async (_event, payload) => {
  const conversationId = payload?.conversationId;
  const messageId = payload?.messageId;

  if (!conversationId || !messageId) {
    return {
      ok: false,
      status: 400,
      error: "conversationId and messageId are required"
    };
  }

  return requestSupportApi({
    path: `/support/conversations/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(messageId)}`,
    method: "PATCH",
    token: payload?.token,
    body: {
      text: payload?.text
    }
  });
});

ipcMain.handle("support:delete-message", async (_event, payload) => {
  const conversationId = payload?.conversationId;
  const messageId = payload?.messageId;

  if (!conversationId || !messageId) {
    return {
      ok: false,
      status: 400,
      error: "conversationId and messageId are required"
    };
  }

  return requestSupportApi({
    path: `/support/conversations/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(messageId)}`,
    method: "DELETE",
    token: payload?.token
  });
});
ipcMain.handle("support:ban-conversation", async (_event, payload) => {
  const conversationId = payload?.conversationId;
  if (!conversationId) {
    return {
      ok: false,
      status: 400,
      error: "conversationId is required"
    };
  }

  return requestSupportApi({
    path: `/support/conversations/${encodeURIComponent(conversationId)}/ban`,
    method: "POST",
    token: payload?.token
  });
});

ipcMain.handle("support:unban-conversation", async (_event, payload) => {
  const conversationId = payload?.conversationId;
  if (!conversationId) {
    return {
      ok: false,
      status: 400,
      error: "conversationId is required"
    };
  }

  return requestSupportApi({
    path: `/support/conversations/${encodeURIComponent(conversationId)}/unban`,
    method: "POST",
    token: payload?.token
  });
});

ipcMain.handle("support:clear-conversation", async (_event, payload) => {
  const conversationId = payload?.conversationId;
  if (!conversationId) {
    return {
      ok: false,
      status: 400,
      error: "conversationId is required"
    };
  }

  return requestSupportApi({
    path: `/support/conversations/${encodeURIComponent(conversationId)}/clear`,
    method: "POST",
    token: payload?.token
  });
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
