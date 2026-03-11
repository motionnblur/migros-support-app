import React from "react";
import { Alert, Avatar, Box, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ConversationList from "./ConversationList";
import ChatPanel from "./ChatPanel";

const navActions = [
  { id: "inbox", icon: ForumRoundedIcon, label: "Inbox" },
  { id: "dashboard", icon: DashboardRoundedIcon, label: "Dashboard" },
  { id: "insights", icon: InsightsRoundedIcon, label: "Insights" },
  { id: "settings", icon: SettingsRoundedIcon, label: "Settings" }
];

function formatConversation(rawConversation) {
  const date = rawConversation?.lastMessageAt ? new Date(rawConversation.lastMessageAt) : null;
  const time = date && !Number.isNaN(date.getTime())
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  return {
    id: rawConversation?.conversationId,
    name: rawConversation?.customerId || "Customer",
    customer: rawConversation?.customerId || "Unknown",
    preview: rawConversation?.lastMessagePreview || "No messages yet",
    time,
    unread: Number(rawConversation?.unreadCount || 0),
    priority: Number(rawConversation?.unreadCount || 0) > 5 ? "Urgent" : Number(rawConversation?.unreadCount || 0) > 0 ? "High" : "Normal",
    channel: "Website"
  };
}

function formatMessage(rawMessage) {
  const date = rawMessage?.occurredAt ? new Date(rawMessage.occurredAt) : null;
  const time = date && !Number.isNaN(date.getTime())
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  const isAgent = rawMessage?.sender === "AGENT" || rawMessage?.sender === "MANAGEMENT";

  return {
    id: rawMessage?.id || rawMessage?.messageId,
    type: isAgent ? "agent" : "customer",
    author: isAgent ? "Support Agent" : rawMessage?.customerId || "Customer",
    text: rawMessage?.text || "",
    time
  };
}

export default function SupportWorkspace({ currentUser, logout, accessToken }) {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [conversations, setConversations] = React.useState([]);
  const [selectedConversationId, setSelectedConversationId] = React.useState("");
  const [messagesByConversation, setMessagesByConversation] = React.useState({});
  const [mobileView, setMobileView] = React.useState("list");
  const [activeNav, setActiveNav] = React.useState("inbox");
  const [loadingConversations, setLoadingConversations] = React.useState(true);
  const [loadingMessages, setLoadingMessages] = React.useState(false);
  const [error, setError] = React.useState("");

  const fetchConversations = React.useCallback(async () => {
    const result = await window.electronAPI.getConversations(accessToken);

    if (!result.ok) {
      if (result.status === 401) {
        logout("Session expired. Please sign in again.");
        return;
      }

      setError(result.error || "Failed to load conversations");
      return;
    }

    const formatted = Array.isArray(result.data) ? result.data.map(formatConversation) : [];
    setConversations(formatted);

    if (!selectedConversationId && formatted.length > 0) {
      setSelectedConversationId(formatted[0].id);
    }

    if (selectedConversationId && !formatted.some((conversation) => conversation.id === selectedConversationId)) {
      setSelectedConversationId(formatted[0]?.id || "");
    }

    setError("");
  }, [accessToken, logout, selectedConversationId]);

  const fetchMessages = React.useCallback(
    async (conversationId) => {
      if (!conversationId) {
        return;
      }

      setLoadingMessages(true);
      const result = await window.electronAPI.getMessages(accessToken, conversationId);
      setLoadingMessages(false);

      if (!result.ok) {
        if (result.status === 401) {
          logout("Session expired. Please sign in again.");
          return;
        }

        setError(result.error || "Failed to load messages");
        return;
      }

      const formatted = Array.isArray(result.data) ? result.data.map(formatMessage) : [];
      setMessagesByConversation((previous) => ({
        ...previous,
        [conversationId]: formatted
      }));
      setError("");
    },
    [accessToken, logout]
  );

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoadingConversations(true);
      await fetchConversations();
      if (!cancelled) {
        setLoadingConversations(false);
      }
    };

    load();

    const interval = setInterval(fetchConversations, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [fetchConversations]);

  React.useEffect(() => {
    if (!selectedConversationId) {
      return undefined;
    }

    fetchMessages(selectedConversationId);

    const interval = setInterval(() => {
      fetchMessages(selectedConversationId);
    }, 4000);

    return () => clearInterval(interval);
  }, [fetchMessages, selectedConversationId]);

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
    setActiveNav("inbox");
    if (isMobile) {
      setMobileView("chat");
    }
  };

  const handleSendMessage = async (text) => {
    if (!selectedConversationId) {
      return { ok: false, error: "No conversation selected" };
    }

    const result = await window.electronAPI.sendMessage(accessToken, selectedConversationId, text);
    if (!result.ok) {
      if (result.status === 401) {
        logout("Session expired. Please sign in again.");
      } else {
        setError(result.error || "Failed to send message");
      }
      return { ok: false, error: result.error || "Failed to send message" };
    }

    await Promise.all([fetchMessages(selectedConversationId), fetchConversations()]);
    return { ok: true };
  };

  const activeConversation = conversations.find((conversation) => conversation.id === selectedConversationId) || null;
  const activeMessages = activeConversation ? messagesByConversation[activeConversation.id] || [] : [];

  const showList = !isMobile || mobileView === "list";
  const showChat = !isMobile || mobileView === "chat";

  return (
    <Box
      sx={{
        "@keyframes rise": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" }
        },
        "@keyframes pulseGlow": {
          "0%": { boxShadow: "0 0 0 0 rgba(59,130,246,0.45)" },
          "100%": { boxShadow: "0 0 0 10px rgba(59,130,246,0)" }
        },
        minHeight: "100vh",
        p: { xs: 1, md: 2 },
        background:
          "radial-gradient(1200px circle at -10% -20%, #dbeafe 0%, #eef2ff 30%, #f8fafc 60%, #f1f5f9 100%)"
      }}
    >
      <Box
        sx={{
          height: { xs: "calc(100vh - 16px)", md: "calc(100vh - 32px)" },
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid #dbe2ef",
          bgcolor: "#f8fafc",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.12)",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "76px minmax(280px, 330px) 1fr"
          }
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            py: 2,
            bgcolor: "#0f172a",
            color: "#e2e8f0"
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: "#2563eb",
              color: "white",
              animation: "pulseGlow 2.2s infinite"
            }}
          >
            <ForumRoundedIcon fontSize="small" />
          </Box>

          {navActions.map((action) => {
            const ActionIcon = action.icon;
            const isActive = action.id === activeNav;

            return (
              <Tooltip key={action.id} title={action.label} placement="right" arrow>
                <IconButton
                  size="small"
                  onClick={() => setActiveNav(action.id)}
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 2,
                    background: isActive ? "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)" : "#1e293b",
                    color: "#e2e8f0",
                    border: isActive ? "1px solid #60a5fa" : "1px solid transparent",
                    boxShadow: isActive ? "0 8px 18px rgba(37,99,235,0.45)" : "none",
                    transition: "all 180ms ease",
                    "&:hover": {
                      transform: "translateY(-1px) scale(1.03)",
                      background: isActive ? "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)" : "#334155"
                    }
                  }}
                >
                  <ActionIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            );
          })}

          <Box sx={{ mt: "auto", mb: 1 }}>
            <Avatar
              sx={{
                bgcolor: "#334155",
                width: 34,
                height: 34,
                border: "2px solid #475569"
              }}
            >
              {currentUser?.username?.[0]?.toUpperCase() || "U"}
            </Avatar>
          </Box>
        </Box>

        {showList ? (
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversation?.id || ""}
            onSelectConversation={handleSelectConversation}
            loading={loadingConversations}
          />
        ) : null}

        {showChat ? (
          <ChatPanel
            isMobile={isMobile}
            activeConversation={activeConversation}
            activeMessages={activeMessages}
            loadingMessages={loadingMessages}
            onBack={() => setMobileView("list")}
            onLogout={() => logout()}
            onSendMessage={handleSendMessage}
          />
        ) : null}
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mt: 1.5 }}>
          {error}
        </Alert>
      ) : null}

      {loadingConversations && conversations.length === 0 ? (
        <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={16} />
          Loading conversations...
        </Box>
      ) : null}
    </Box>
  );
}
