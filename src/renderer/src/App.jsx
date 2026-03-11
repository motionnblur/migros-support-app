import React from "react";
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
  useMediaQuery
} from "@mui/material";

const mockConversations = [
  {
    id: "ord-9021",
    name: "Order #9021",
    customer: "Melis Arslan",
    preview: "Package arrived damaged. Need replacement.",
    time: "09:45",
    unread: 2,
    priority: "High",
    channel: "Website"
  },
  {
    id: "ret-188",
    name: "Return Request",
    customer: "Can Erdem",
    preview: "I want to return two products from yesterday.",
    time: "09:30",
    unread: 0,
    priority: "Normal",
    channel: "Mobile App"
  },
  {
    id: "pay-551",
    name: "Payment Issue",
    customer: "Sena Aydin",
    preview: "Card charged twice on checkout.",
    time: "09:12",
    unread: 4,
    priority: "Urgent",
    channel: "Website"
  },
  {
    id: "ship-774",
    name: "Shipment Delay",
    customer: "Mert Tunc",
    preview: "Tracking has not updated for 4 days.",
    time: "08:57",
    unread: 1,
    priority: "Normal",
    channel: "Marketplace"
  }
];

const mockMessages = {
  "ord-9021": [
    {
      id: "m1",
      type: "customer",
      author: "Melis Arslan",
      text: "Hi team, my package came with a broken corner and missing seal.",
      time: "09:38"
    },
    {
      id: "m2",
      type: "agent",
      author: "You",
      text: "Thanks for reporting this quickly. I can help with a replacement right away.",
      time: "09:40"
    },
    {
      id: "m3",
      type: "customer",
      author: "Melis Arslan",
      text: "Great, I can share photos if needed.",
      time: "09:43"
    },
    {
      id: "m4",
      type: "agent",
      author: "You",
      text: "Please upload 2 photos. I already prepared a priority replacement workflow.",
      time: "09:45"
    }
  ],
  "ret-188": [
    {
      id: "r1",
      type: "customer",
      author: "Can Erdem",
      text: "I ordered the wrong size. Can I return both items in one shipment?",
      time: "09:26"
    },
    {
      id: "r2",
      type: "agent",
      author: "You",
      text: "Yes. I sent one return label for both products.",
      time: "09:30"
    }
  ],
  "pay-551": [
    {
      id: "p1",
      type: "customer",
      author: "Sena Aydin",
      text: "My card was charged twice but only one order was created.",
      time: "09:05"
    },
    {
      id: "p2",
      type: "agent",
      author: "You",
      text: "I can see the duplicate authorization. Finance team is reversing it now.",
      time: "09:10"
    },
    {
      id: "p3",
      type: "customer",
      author: "Sena Aydin",
      text: "Thank you. When should I expect the refund?",
      time: "09:12"
    }
  ],
  "ship-774": [
    {
      id: "s1",
      type: "customer",
      author: "Mert Tunc",
      text: "Tracking has not moved since Friday. Is it lost?",
      time: "08:52"
    },
    {
      id: "s2",
      type: "agent",
      author: "You",
      text: "I escalated to carrier operations and marked this as delayed priority.",
      time: "08:57"
    }
  ]
};

function buildErrorText(result) {
  if (!result) {
    return "Login failed";
  }

  const base = result.error || "Login failed";
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

function isTokenValid(token) {
  if (!token) {
    return false;
  }

  const payload = parseJwtPayload(token);
  if (!payload) {
    return false;
  }

  if (typeof payload.exp !== "number") {
    return false;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp > nowInSeconds;
}

function clearStoredAuth() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function PriorityPill({ priority }) {
  const tone =
    priority === "Urgent"
      ? { bg: "#fee2e2", color: "#b91c1c" }
      : priority === "High"
        ? { bg: "#fff7ed", color: "#c2410c" }
        : { bg: "#e0f2fe", color: "#0369a1" };

  return (
    <Chip
      size="small"
      label={priority}
      sx={{
        height: 22,
        bgcolor: tone.bg,
        color: tone.color,
        fontWeight: 700,
        borderRadius: "999px"
      }}
    />
  );
}

function SupportWorkspace({ currentUser, logout }) {
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
          "radial-gradient(1200px circle at -10% -20%, #dbeafe 0%, #eef2ff 30%, #f8fafc 60%, #f1f5f9 100%)",
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif"
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
            xs: showList ? "1fr" : "1fr",
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
            <Avatar sx={{ bgcolor: "#334155", width: 34, height: 34 }}>{currentUser?.username?.[0]?.toUpperCase() || "U"}</Avatar>
          </Box>
        </Box>

        {showList ? (
          <Box sx={{ display: "flex", flexDirection: "column", borderRight: { md: "1px solid #dbe2ef" }, bgcolor: "#f8fafc" }}>
            <Box sx={{ px: 2, py: 2, borderBottom: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.2 }}>
                  Support Inbox
                </Typography>
                <Chip label="Live" size="small" sx={{ bgcolor: "#dcfce7", color: "#166534", fontWeight: 700 }} />
              </Stack>
              <TextField size="small" fullWidth placeholder="Search conversations, users, orders" />
            </Box>

            <Stack spacing={0} sx={{ overflowY: "auto", p: 1 }}>
              {mockConversations.map((conversation) => {
                const active = conversation.id === activeConversation.id;
                return (
                  <Box
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation.id)}
                    sx={{
                      cursor: "pointer",
                      p: 1.25,
                      borderRadius: 2,
                      mb: 0.75,
                      border: active ? "1px solid #bfdbfe" : "1px solid transparent",
                      bgcolor: active ? "#eaf2ff" : "transparent",
                      transition: "all 180ms ease",
                      "&:hover": { bgcolor: active ? "#eaf2ff" : "#eef2f7" }
                    }}
                  >
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <Avatar sx={{ bgcolor: "#1d4ed8", width: 38, height: 38, fontSize: 14, fontWeight: 700 }}>
                        {conversation.customer
                          .split(" ")
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")}
                      </Avatar>

                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography sx={{ fontWeight: 700, fontSize: 14 }} noWrap>
                            {conversation.name}
                          </Typography>
                          <Typography sx={{ fontSize: 11, color: "#64748b" }}>{conversation.time}</Typography>
                        </Stack>
                        <Typography sx={{ fontSize: 12, color: "#334155" }} noWrap>
                          {conversation.customer}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#64748b" }} noWrap>
                          {conversation.preview}
                        </Typography>
                      </Box>

                      <Stack spacing={0.5} alignItems="flex-end">
                        <PriorityPill priority={conversation.priority} />
                        {conversation.unread > 0 ? (
                          <Badge
                            badgeContent={conversation.unread}
                            color="primary"
                            sx={{ "& .MuiBadge-badge": { fontSize: 10, minWidth: 18, height: 18 } }}
                          >
                            <Box sx={{ width: 10, height: 10 }} />
                          </Badge>
                        ) : null}
                      </Stack>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        ) : null}

        {showChat ? (
          <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0, bgcolor: "#eef3fb" }}>
            <Box
              sx={{
                px: { xs: 1.5, md: 2.5 },
                py: 1.4,
                borderBottom: "1px solid #dbe2ef",
                bgcolor: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: 1.25
              }}
            >
              {isMobile ? (
                <Button size="small" variant="text" onClick={() => setMobileView("list")}>
                  Back
                </Button>
              ) : null}
              <Avatar sx={{ bgcolor: "#0f766e", width: 36, height: 36 }}>
                {activeConversation.customer
                  .split(" ")
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontWeight: 800 }} noWrap>
                  {activeConversation.name}
                </Typography>
                <Typography sx={{ color: "#64748b", fontSize: 12 }} noWrap>
                  {activeConversation.customer} | {activeConversation.channel}
                </Typography>
              </Box>
              <PriorityPill priority={activeConversation.priority} />
              <Button size="small" variant="outlined" onClick={() => logout()}>
                Logout
              </Button>
            </Box>

            <Box sx={{ flex: 1, overflowY: "auto", px: { xs: 1.2, md: 3 }, py: 2 }}>
              <Stack spacing={1.2}>
                {activeMessages.map((message, index) => {
                  const isAgent = message.type === "agent";
                  return (
                    <Box
                      key={message.id}
                      sx={{
                        alignSelf: isAgent ? "flex-end" : "flex-start",
                        maxWidth: "min(78%, 680px)",
                        animation: "rise 260ms ease",
                        animationDelay: `${index * 40}ms`
                      }}
                    >
                      <Card
                        sx={{
                          borderRadius: isAgent ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                          bgcolor: isAgent ? "#dbeafe" : "#ffffff",
                          border: "1px solid",
                          borderColor: isAgent ? "#bfdbfe" : "#e2e8f0",
                          boxShadow: "none"
                        }}
                      >
                        <CardContent sx={{ p: "10px 12px !important" }}>
                          <Typography sx={{ fontWeight: 700, fontSize: 12.5, color: "#1e3a8a", mb: 0.5 }}>
                            {message.author}
                          </Typography>
                          <Typography sx={{ fontSize: 13.5, color: "#0f172a" }}>{message.text}</Typography>
                          <Typography sx={{ fontSize: 11, color: "#64748b", textAlign: "right", mt: 0.7 }}>
                            {message.time}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  );
                })}
              </Stack>
            </Box>

            <Divider />
            <Box sx={{ p: { xs: 1.2, md: 1.7 }, bgcolor: "#ffffff" }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Button variant="text" sx={{ minWidth: 40 }}>
                  +
                </Button>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Write a reply to the customer..."
                  multiline
                  maxRows={4}
                />
                <Button variant="contained">Send</Button>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip size="small" label="Escalate" />
                <Chip size="small" label="Refund template" />
                <Chip size="small" label="Track shipment" />
              </Stack>
            </Box>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

export default function App() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [sessionLoading, setSessionLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [error, setError] = React.useState("");

  const logout = React.useCallback((message = "") => {
    clearStoredAuth();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setPassword("");
    if (message) {
      setError(message);
    }
  }, []);

  React.useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = getStoredUser();

    if (isTokenValid(token) && user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      setError("");
    } else {
      clearStoredAuth();
      setIsAuthenticated(false);
      setCurrentUser(null);
    }

    setSessionLoading(false);
  }, []);

  React.useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    const interval = setInterval(() => {
      const token = localStorage.getItem("accessToken");
      if (!isTokenValid(token)) {
        logout("Session expired. Please sign in again.");
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, logout]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    setLoading(true);
    try {
      const result = await window.electronAPI.login({ username, password });

      if (!result.ok) {
        setError(buildErrorText(result));
        return;
      }

      const { accessToken, user } = result.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      setIsAuthenticated(true);
      setCurrentUser(user);
      setPassword("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          px: 2,
          background: "radial-gradient(1200px circle at 10% 10%, #dbe7ff 0%, #f6f8ff 35%, #fefefe 70%)"
        }}
      >
        <Typography>Checking session...</Typography>
      </Box>
    );
  }

  if (isAuthenticated) {
    return <SupportWorkspace currentUser={currentUser} logout={logout} />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        background: "radial-gradient(1200px circle at 10% 10%, #dbe7ff 0%, #f6f8ff 35%, #fefefe 70%)"
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Stack spacing={1}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Sign in
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Continue to Support Workspace
              </Typography>
            </Stack>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <TextField
              label="Username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              fullWidth
              required
              autoComplete="username"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
              required
              autoComplete="current-password"
            />

            <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
