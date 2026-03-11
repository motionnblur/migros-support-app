import React from "react";
import { Avatar, Badge, Box, Chip, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import PriorityPill from "./PriorityPill";

function ChannelIcon({ channel }) {
  if (channel === "Mobile App") {
    return <SmartphoneRoundedIcon sx={{ fontSize: 14 }} />;
  }

  if (channel === "Marketplace") {
    return <StorefrontRoundedIcon sx={{ fontSize: 14 }} />;
  }

  return <LanguageRoundedIcon sx={{ fontSize: 14 }} />;
}

export default function ConversationList({ conversations, activeConversationId, onSelectConversation }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", borderRight: { md: "1px solid #dbe2ef" }, bgcolor: "#f8fafc" }}>
      <Box sx={{ px: 2, py: 2, borderBottom: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.2 }}>
            Support Inbox
          </Typography>
          <Chip
            icon={<LanguageRoundedIcon sx={{ fontSize: "16px !important" }} />}
            label="Live"
            size="small"
            sx={{ bgcolor: "#dcfce7", color: "#166534", fontWeight: 700 }}
          />
        </Stack>
        <TextField
          size="small"
          fullWidth
          placeholder="Search conversations, users, orders"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: "#64748b", fontSize: 18 }} />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <Stack spacing={0} sx={{ overflowY: "auto", p: 1 }}>
        {conversations.map((conversation) => {
          const active = conversation.id === activeConversationId;

          return (
            <Box
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
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
                  <Stack direction="row" spacing={0.6} alignItems="center" sx={{ color: "#64748b" }}>
                    <ChannelIcon channel={conversation.channel} />
                    <Typography sx={{ fontSize: 12 }} noWrap>
                      {conversation.preview}
                    </Typography>
                  </Stack>
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
  );
}
