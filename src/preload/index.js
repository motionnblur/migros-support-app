import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  ping: () => "pong",
  login: (credentials) => ipcRenderer.invoke("auth:login", credentials),
  getConversations: (token) => ipcRenderer.invoke("support:get-conversations", { token }),
  getMessages: (token, conversationId) =>
    ipcRenderer.invoke("support:get-messages", { token, conversationId }),
  sendMessage: (token, conversationId, text) =>
    ipcRenderer.invoke("support:send-message", { token, conversationId, text }),
  editMessage: (token, conversationId, messageId, text) =>
    ipcRenderer.invoke("support:edit-message", { token, conversationId, messageId, text }),
  banConversation: (token, conversationId) =>
    ipcRenderer.invoke("support:ban-conversation", { token, conversationId }),
  unbanConversation: (token, conversationId) =>
    ipcRenderer.invoke("support:unban-conversation", { token, conversationId }),
  clearConversation: (token, conversationId) =>
    ipcRenderer.invoke("support:clear-conversation", { token, conversationId })
});
