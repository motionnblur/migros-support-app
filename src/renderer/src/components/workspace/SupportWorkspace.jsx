import React from "react";
import { Avatar, Box } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import ConversationList from "./ConversationList";
import ChatPanel from "./ChatPanel";
import { mockConversations, mockMessages } from "../../data/mockSupportData";

export default function SupportWorkspace({ currentUser, logout }) {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [selectedConversationId, setSelectedConversationId] = React.useState(mockConversations[0].id);
  const [mobileView, setMobileView] = React.useState("list");

  const activeConversation =
    mockConversations.find((conversation) => conversation.id === selectedConversationId) || mockConversations[0];
  const activeMessages = mockMessages[activeConversation.id] || [];

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
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
        minHeight: "100vh",
        p: { xs: 1, md: 2 },
        background:
          "radial-gradient(1200px circle at -10% -20%, #dbeafe 0%, #eef2ff 30%, #f8fafc 60%, #f1f5f9 100%)"
      }}
    >
      <Box
        sx={{
          height: { xs: "calc(100vh - 16px)", md: "calc(100vh - 32px)" },
          borderRadius: 4,
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
            gap: 2,
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
              fontWeight: 800
            }}
          >
            S
          </Box>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: "#1e293b", display: "grid", placeItems: "center" }}>
            C
          </Box>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: "#1e293b", display: "grid", placeItems: "center" }}>
            T
          </Box>
          <Box sx={{ mt: "auto", mb: 1 }}>
            <Avatar sx={{ bgcolor: "#334155", width: 34, height: 34 }}>
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
