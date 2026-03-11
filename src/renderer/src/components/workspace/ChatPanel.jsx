import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import AssignmentReturnRoundedIcon from "@mui/icons-material/AssignmentReturnRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PriorityPill from "./PriorityPill";

export default function ChatPanel({ isMobile, activeConversation, activeMessages, onBack, onLogout }) {
  return (
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
        <Button size="small" variant="outlined" color="inherit" startIcon={<LogoutRoundedIcon />} onClick={onLogout}>
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
          <IconButton sx={{ border: "1px solid #dbe2ef" }}>
            <AttachFileRoundedIcon fontSize="small" />
          </IconButton>
          <TextField
            fullWidth
            size="small"
            placeholder="Write a reply to the customer..."
            multiline
            maxRows={4}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Enter to send
                  </Typography>
                </InputAdornment>
              )
            }}
          />
          <Button variant="contained" endIcon={<SendRoundedIcon />}>
            Send
          </Button>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Chip size="small" icon={<ReportProblemRoundedIcon />} label="Escalate" />
          <Chip size="small" icon={<AssignmentReturnRoundedIcon />} label="Refund template" />
          <Chip size="small" icon={<LocalShippingRoundedIcon />} label="Track shipment" />
        </Stack>
      </Box>
    </Box>
  );
}
