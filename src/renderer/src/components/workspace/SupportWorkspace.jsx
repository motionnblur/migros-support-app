import React from "react";
import { Avatar, Box, IconButton, Tooltip } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ConversationList from "./ConversationList";
import ChatPanel from "./ChatPanel";
import { mockConversations, mockMessages } from "../../data/mockSupportData";

const navActions = [
  { id: "inbox", icon: ForumRoundedIcon, label: "Inbox" },
  { id: "dashboard", icon: DashboardRoundedIcon, label: "Dashboard" },
  { id: "insights", icon: InsightsRoundedIcon, label: "Insights" },
  { id: "settings", icon: SettingsRoundedIcon, label: "Settings" }
];

export default function SupportWorkspace({ currentUser, logout }) {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [selectedConversationId, setSelectedConversationId] = React.useState(mockConversations[0].id);
  const [mobileView, setMobileView] = React.useState("list");
  const [activeNav, setActiveNav] = React.useState("inbox");

  const activeConversation =
    mockConversations.find((conversation) => conversation.id === selectedConversationId) || mockConversations[0];
  const activeMessages = mockMessages[activeConversation.id] || [];

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
    setActiveNav("inbox");
    if (isMobile) {
      setMobileView("chat");
    }
  };

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
            conversations={mockConversations}
            activeConversationId={activeConversation.id}
            onSelectConversation={handleSelectConversation}
          />
        ) : null}

        {showChat ? (
          <ChatPanel
            isMobile={isMobile}
            activeConversation={activeConversation}
            activeMessages={activeMessages}
            onBack={() => setMobileView("list")}
            onLogout={() => logout()}
          />
        ) : null}
      </Box>
    </Box>
  );
}

