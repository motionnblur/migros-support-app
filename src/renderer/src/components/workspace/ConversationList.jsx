import React from "react";
import { Avatar, Badge, Box, Chip, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
import PriorityPill from "./PriorityPill";

function ChannelIcon({ channel }) {
  if (channel === "Mobile App") {
    return <SmartphoneRoundedIcon sx={{ fontSize: 14, color: "#0369a1" }} />;
  }

  if (channel === "Marketplace") {
    return <StorefrontRoundedIcon sx={{ fontSize: 14, color: "#7c3aed" }} />;
  }

  return <LanguageRoundedIcon sx={{ fontSize: 14, color: "#0891b2" }} />;
}

export default function ConversationList({ conversations, activeConversationId, onSelectConversation, loading }) {
  const hasConversations = conversations.length > 0;

  return (
    <Box
      sx={{
        "@keyframes pulseUnread": {
          "0%": { opacity: 0.5, transform: "scale(0.9)" },
          "50%": { opacity: 1, transform: "scale(1.2)" },
          "100%": { opacity: 0.5, transform: "scale(0.9)" }
        },
        display: "flex",
        flexDirection: "column",
        borderRight: { md: "1px solid #dbe2ef" },
        bgcolor: "#f8fafc",
        minHeight: 0
      }}
    >
      <Box sx={{ px: 2, py: 2, borderBottom: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.2 }}>
            Mesaj Kutusu
          </Typography>
          <Chip
            icon={<LanguageRoundedIcon sx={{ fontSize: "16px !important" }} />}
            label="Canlı"
            size="small"
            sx={{ bgcolor: "#dcfce7", color: "#166534", fontWeight: 700 }}
          />
        </Stack>
        <TextField
          size="small"
          fullWidth
          placeholder="Mesaj kutusunda ara"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: "#64748b", fontSize: 18 }} />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <Stack spacing={0} sx={{ overflowY: "auto", p: 1, minHeight: 0 }}>
        {conversations.map((conversation) => {
          const active = conversation.id === activeConversationId;

          return (
            <Box
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              sx={{
                cursor: "pointer",
                position: "relative",
                p: 1.25,
                borderRadius: 2,
                mb: 0.75,
                border: active ? "1px solid #93c5fd" : "1px solid transparent",
                bgcolor: active ? "#eaf2ff" : "transparent",
                boxShadow: active ? "0 8px 16px rgba(30,64,175,0.12)" : "none",
                transition: "all 180ms ease",
                "&::before": active
                  ? {
                      content: '""',
                      position: "absolute",
                      left: -1,
                      top: 10,
                      bottom: 10,
                      width: 3,
                      borderRadius: 2,
                      bgcolor: "#2563eb"
                    }
                  : {},
                "&:hover": {
                  bgcolor: active ? "#eaf2ff" : "#eef2f7",
                  transform: "translateY(-1px)"
                }
              }}
            >
              <Stack direction="row" spacing={1.2} alignItems="center">
                <Avatar sx={{ bgcolor: active ? "#1d4ed8" : "#2563eb", width: 38, height: 38, fontSize: 14, fontWeight: 700 }}>
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
                    <Stack direction="row" spacing={0.6} alignItems="center">
                      {conversation.unread > 0 ? (
                        <FiberManualRecordRoundedIcon
                          sx={{
                            fontSize: 8,
                            color: "#22c55e",
                            animation: "pulseUnread 1.4s ease-in-out infinite"
                          }}
                        />
                      ) : null}
                      <Typography sx={{ fontSize: 11, color: "#64748b" }}>{conversation.time}</Typography>
                    </Stack>
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
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: 10,
                          minWidth: 18,
                          height: 18,
                          fontWeight: 700,
                          boxShadow: "0 0 0 2px #f8fafc"
                        }
                      }}
                    >
                      <Box sx={{ width: 10, height: 10 }} />
                    </Badge>
                  ) : null}
                </Stack>
              </Stack>
            </Box>
          );
        })}

        {!loading && !hasConversations ? (
          <Box sx={{ p: 2, color: "#64748b", textAlign: "center", fontSize: 14 }}>
            No customer conversations yet.
          </Box>
        ) : null}
      </Stack>
    </Box>
  );
}



