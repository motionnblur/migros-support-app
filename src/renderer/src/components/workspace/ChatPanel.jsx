import React from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
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
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SentimentSatisfiedAltRoundedIcon from "@mui/icons-material/SentimentSatisfiedAltRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PriorityPill from "./PriorityPill";

export default function ChatPanel({
  isMobile,
  activeConversation,
  activeMessages,
  loadingMessages,
  onBack,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onBanConversation,
  onUnbanConversation,
  onClearConversation,
  actionBusy,
  conversationActionsDisabled = false,
  activeConversationOnline
}) {
  const [draftMessage, setDraftMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [editingMessageId, setEditingMessageId] = React.useState("");
  const [editDraftMessage, setEditDraftMessage] = React.useState("");
  const [savingEdit, setSavingEdit] = React.useState(false);
  const [deletingMessageId, setDeletingMessageId] = React.useState("");
  const messagesContainerRef = React.useRef(null);

  React.useEffect(() => {
    if (!messagesContainerRef.current) {
      return;
    }

    const container = messagesContainerRef.current;
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, [activeConversation?.id, activeMessages]);

  React.useEffect(() => {
    setEditingMessageId("");
    setEditDraftMessage("");
    setSavingEdit(false);
    setDeletingMessageId("");
  }, [activeConversation?.id]);

  const submitMessage = async () => {
    const text = draftMessage.trim();
    if (!text || sending || activeConversation?.isBanned) {
      return;
    }

    setSending(true);
    const result = await onSendMessage(text);
    setSending(false);

    if (result?.ok) {
      setDraftMessage("");
    }
  };

  const startEditMessage = (message) => {
    const messageId = message?.messageId || String(message?.id || "");
    if (!messageId || !onEditMessage) {
      return;
    }

    setEditingMessageId(messageId);
    setEditDraftMessage(message?.text || "");
  };

  const cancelEditMessage = () => {
    if (savingEdit || deletingMessageId) {
      return;
    }

    setEditingMessageId("");
    setEditDraftMessage("");
  };

  const saveEditedMessage = async () => {
    const text = editDraftMessage.trim();
    if (!editingMessageId || !text || !onEditMessage || savingEdit || deletingMessageId) {
      return;
    }

    setSavingEdit(true);
    const result = await onEditMessage(editingMessageId, text);
    setSavingEdit(false);

    if (result?.ok) {
      setEditingMessageId("");
      setEditDraftMessage("");
    }
  };

  const startDeleteMessage = async (message) => {
    const messageId = message?.messageId || String(message?.id || "");
    if (!messageId || !onDeleteMessage || savingEdit || deletingMessageId) {
      return;
    }

    const shouldDelete = window.confirm("Bu mesaji silmek istediginize emin misiniz?");
    if (!shouldDelete) {
      return;
    }

    setDeletingMessageId(messageId);
    const result = await onDeleteMessage(messageId);
    setDeletingMessageId("");

    if (result?.ok && editingMessageId === messageId) {
      setEditingMessageId("");
      setEditDraftMessage("");
    }
  };

  const handleBanToggle = async () => {
    if (actionBusy || conversationActionsDisabled) {
      return;
    }

    if (activeConversation?.isBanned) {
      if (!onUnbanConversation) {
        return;
      }

      await onUnbanConversation();
      return;
    }

    if (!onBanConversation) {
      return;
    }

    await onBanConversation();
  };

  const handleClear = async () => {
    if (!onClearConversation || actionBusy || conversationActionsDisabled) {
      return;
    }

    await onClearConversation();
  };

  const hasPresence = typeof activeConversationOnline === "boolean";
  const presenceLabel = hasPresence ? (activeConversationOnline ? "Cevrimici" : "Cevrimdisi") : "Kontrol ediliyor...";
  const presenceColor = hasPresence ? (activeConversationOnline ? "#16a34a" : "#64748b") : "#94a3b8";

  if (!activeConversation) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: 280, color: "#64748b" }}>
        Musterilere destek vermek icin bir konusma secin.
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0, bgcolor: "#eef3fb" }}>
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
        <Avatar sx={{ bgcolor: activeConversation.isBanned ? "#991b1b" : "#0f766e", width: 36, height: 36 }}>
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
          <Stack direction="row" spacing={1.1} alignItems="center" sx={{ minWidth: 0 }}>
            <Typography sx={{ color: "#64748b", fontSize: 12 }} noWrap>
              {activeConversation.customer} | {activeConversation.channel}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ minWidth: 0 }}>
              <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: presenceColor }} />
              <Typography sx={{ color: presenceColor, fontSize: 11.5, fontWeight: 700 }}>
                {presenceLabel}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <PriorityPill priority={activeConversation.priority} />

        <Tooltip title="Sohbette ara">
          <IconButton size="small" sx={{ border: "1px solid #e2e8f0" }}>
            <SearchRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title={activeConversation.isBanned ? "Kullanicinin yasagini kaldir" : "Kullaniciyi yasakla"}>
          <span>
            <IconButton
              size="small"
              onClick={handleBanToggle}
              disabled={actionBusy || conversationActionsDisabled}
              sx={{
                border: activeConversation.isBanned ? "1px solid #86efac" : "1px solid #fecaca",
                color: activeConversation.isBanned ? "#166534" : "#b91c1c",
                bgcolor: activeConversation.isBanned ? "#dcfce7" : "transparent"
              }}
            >
              {activeConversation.isBanned ? (
                <LockOpenRoundedIcon sx={{ fontSize: 18 }} />
              ) : (
                <BlockRoundedIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Sohbet gecmisini temizle">
          <span>
            <IconButton
              size="small"
              onClick={handleClear}
              disabled={actionBusy || conversationActionsDisabled}
              sx={{ border: "1px solid #fed7aa", color: "#c2410c" }}
            >
              <DeleteSweepRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {conversationActionsDisabled ? (
        <Alert severity="info" sx={{ m: 1.5, mb: 0, border: "1px solid #bfdbfe" }}>
          Bu musterinin henuz bir konusmasi yok. Baslatmak icin ilk mesaji gonderin.
        </Alert>
      ) : null}

      {activeConversation.isBanned ? (
        <Alert severity="warning" sx={{ m: 1.5, mb: 0, border: "1px solid #fca5a5" }}>
          Bu kullanici yasakli. Yeni giden mesajlar devre disi.
        </Alert>
      ) : null}

      <Box ref={messagesContainerRef} sx={{ flex: 1, minHeight: 0, overflowY: "auto", px: { xs: 1.2, md: 3 }, py: 2 }}>
        {loadingMessages ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748b" }}>
            <CircularProgress size={16} />
            Mesajlar yukleniyor...
          </Box>
        ) : (
          <Stack spacing={1.2}>
            {activeMessages.map((message) => {
              const isAgent = message.type === "agent";
              const messageId = message.messageId || String(message.id || "");
              const isEditing = editingMessageId && editingMessageId === messageId;
              const isDeleting = deletingMessageId && deletingMessageId === messageId;
              const canStartEdit = isAgent && message.canEdit && !savingEdit && !deletingMessageId;
              const canStartDelete = isAgent && message.canEdit && !savingEdit && !deletingMessageId;

              return (
                <Box
                  key={message.id}
                  sx={{
                    alignSelf: isAgent ? "flex-end" : "flex-start",
                    maxWidth: "min(78%, 680px)"
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
                      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                        <Typography sx={{ fontWeight: 700, fontSize: 12.5, color: "#1e3a8a", mb: 0.5 }}>
                          {message.author}
                        </Typography>

                        {!isEditing && (canStartEdit || canStartDelete || isDeleting) ? (
                          <Stack direction="row" spacing={0.7} alignItems="center">
                            {canStartEdit ? (
                              <Tooltip title="Mesaji duzenle">
                                <IconButton
                                  size="small"
                                  onClick={() => startEditMessage(message)}
                                  sx={{ border: "1px solid #bfdbfe", width: 22, height: 22 }}
                                >
                                  <EditRoundedIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                              </Tooltip>
                            ) : null}

                            {isDeleting ? (
                              <CircularProgress size={14} />
                            ) : canStartDelete ? (
                              <Tooltip title="Mesaji sil">
                                <IconButton
                                  size="small"
                                  onClick={() => startDeleteMessage(message)}
                                  sx={{ border: "1px solid #fecaca", color: "#b91c1c", width: 22, height: 22 }}
                                >
                                  <DeleteOutlineRoundedIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                              </Tooltip>
                            ) : null}
                          </Stack>
                        ) : null}
                      </Stack>

                      {isEditing ? (
                        <Stack spacing={1}>
                          <TextField
                            multiline
                            fullWidth
                            minRows={2}
                            maxRows={6}
                            size="small"
                            value={editDraftMessage}
                            onChange={(event) => setEditDraftMessage(event.target.value)}
                            disabled={savingEdit || Boolean(deletingMessageId)}
                          />
                          <Stack direction="row" spacing={0.8} justifyContent="flex-end">
                            <Button
                              size="small"
                              variant="outlined"
                              color="inherit"
                              startIcon={<CloseRoundedIcon />}
                              onClick={cancelEditMessage}
                              disabled={savingEdit || Boolean(deletingMessageId)}
                            >
                              Iptal
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<CheckRoundedIcon />}
                              onClick={saveEditedMessage}
                              disabled={savingEdit || Boolean(deletingMessageId) || !editDraftMessage.trim()}
                            >
                              {savingEdit ? "Kaydediliyor..." : "Kaydet"}
                            </Button>
                          </Stack>
                        </Stack>
                      ) : (
                        <Typography sx={{ fontSize: 13.5, color: "#0f172a" }}>{message.text}</Typography>
                      )}

                      <Typography sx={{ fontSize: 11, color: "#64748b", textAlign: "right", mt: 0.7 }}>
                        {message.time}
                        {message.editedAt ? " - duzenlendi" : ""}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              );
            })}

            {!activeMessages.length ? (
              <Box sx={{ color: "#64748b", fontSize: 14 }}>Henuz mesaj yok.</Box>
            ) : null}
          </Stack>
        )}
      </Box>

      <Divider />
      <Box sx={{ p: { xs: 1.2, md: 1.7 }, bgcolor: "#ffffff" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            fullWidth
            size="small"
            placeholder={activeConversation.isBanned ? "Kullanici yasakli" : "Mesajinizi yazin..."}
            multiline
            maxRows={4}
            value={draftMessage}
            disabled={activeConversation.isBanned}
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
                    Gondermek icin Enter
                  </Typography>
                </InputAdornment>
              )
            }}
          />
          <Button
            variant="contained"
            endIcon={<SendRoundedIcon />}
            disabled={sending || !draftMessage.trim() || activeConversation.isBanned}
            onClick={submitMessage}
            sx={{
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              boxShadow: "0 10px 20px rgba(37,99,235,0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)"
              }
            }}
          >
            {sending ? "Gonderiliyor..." : "Gonder"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}