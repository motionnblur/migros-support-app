import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import SentimentSatisfiedAltRoundedIcon from "@mui/icons-material/SentimentSatisfiedAltRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import AssignmentReturnRoundedIcon from "@mui/icons-material/AssignmentReturnRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PriorityPill from "./PriorityPill";

export default function ChatPanel({
  isMobile,
  activeConversation,
  activeMessages,
  loadingMessages,
  onBack,
  onLogout,
  onSendMessage
}) {
  const [draftMessage, setDraftMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const submitMessage = async () => {
    const text = draftMessage.trim();
    if (!text || sending) {
      return;
    }

    setSending(true);
    const result = await onSendMessage(text);
    setSending(false);

    if (result?.ok) {
      setDraftMessage("");
    }
  };

  if (!activeConversation) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: 280, color: "#64748b" }}>
        Select a conversation to start supporting customers.
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0, bgcolor: "#eef3fb" }}>
      <Box
        sx={{
          px: { xs: 1.5, md: 2.5 },
          py: 1.2,
          borderBottom: "1px solid #dbe2ef",
          bgcolor: "#ffffff",
          display: "flex",
          alignItems: "center",
          gap: 1
        }}
      >
        {isMobile ? (
          <IconButton size="small" onClick={onBack} sx={{ border: "1px solid #e2e8f0" }}>
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
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

        <Tooltip title="Search in chat">
          <IconButton size="small" sx={{ border: "1px solid #e2e8f0" }}>
            <SearchRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="More actions">
          <IconButton size="small" sx={{ border: "1px solid #e2e8f0" }}>
            <MoreVertRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Button size="small" variant="outlined" color="inherit" startIcon={<LogoutRoundedIcon />} onClick={onLogout}>
          Logout
        </Button>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: { xs: 1.2, md: 3 }, py: 2 }}>
        {loadingMessages ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748b" }}>
            <CircularProgress size={16} />
            Loading messages...
          </Box>
        ) : (
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
                      boxShadow: "none",
                      transition: "transform 160ms ease, box-shadow 160ms ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 8px 16px rgba(15,23,42,0.08)"
                      }
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

            {!activeMessages.length ? (
              <Box sx={{ color: "#64748b", fontSize: 14 }}>No messages yet.</Box>
            ) : null}
          </Stack>
        )}
      </Box>

      <Divider />
      <Box sx={{ p: { xs: 1.2, md: 1.7 }, bgcolor: "#ffffff" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            sx={{
              border: "1px solid #dbe2ef",
              transition: "all 180ms ease",
              "&:hover": { transform: "rotate(-8deg)", bgcolor: "#eff6ff" }
            }}
          >
            <AttachFileRoundedIcon fontSize="small" />
          </IconButton>
          <TextField
            fullWidth
            size="small"
            placeholder="Write a reply to the customer..."
            multiline
            maxRows={4}
            value={draftMessage}
            onChange={(event) => setDraftMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submitMessage();
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SentimentSatisfiedAltRoundedIcon sx={{ color: "#64748b", fontSize: 18 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Enter to send
                  </Typography>
                </InputAdornment>
              )
            }}
          />
          <Button
            variant="contained"
            endIcon={<SendRoundedIcon />}
            disabled={sending || !draftMessage.trim()}
            onClick={submitMessage}
            sx={{
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              boxShadow: "0 10px 20px rgba(37,99,235,0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)"
              }
            }}
          >
            {sending ? "Sending..." : "Send"}
          </Button>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Chip size="small" icon={<ReportProblemRoundedIcon />} label="Escalate" sx={{ "&:hover": { bgcolor: "#fee2e2" } }} />
          <Chip
            size="small"
            icon={<AssignmentReturnRoundedIcon />}
            label="Refund template"
            sx={{ "&:hover": { bgcolor: "#e0f2fe" } }}
          />
          <Chip
            size="small"
            icon={<LocalShippingRoundedIcon />}
            label="Track shipment"
            sx={{ "&:hover": { bgcolor: "#ede9fe" } }}
          />
        </Stack>
      </Box>
    </Box>
  );
}
