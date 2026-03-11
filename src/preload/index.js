import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  ping: () => "pong",
  login: (credentials) => ipcRenderer.invoke("auth:login", credentials),
  getConversations: (token) => ipcRenderer.invoke("support:get-conversations", { token }),
  getMessages: (token, conversationId) =>
    ipcRenderer.invoke("support:get-messages", { token, conversationId }),
  sendMessage: (token, conversationId, text) =>
    ipcRenderer.invoke("support:send-message", { token, conversationId, text })
});
