import React from "react";
import { Alert, Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";

export default function AccessDeniedView({ user, message, onRetry, onLogout }) {
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
      <Card sx={{ width: "100%", maxWidth: 520 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={2.5}>
            <Stack spacing={0.5}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Erisim Reddedildi
              </Typography>
              <Typography sx={{ color: "#475569", fontSize: 14 }}>
                Bu hesap ile destek paneline erisim izni yok.
              </Typography>
            </Stack>

            <Alert severity="warning">{message || "Bu islem icin gerekli destek yetkiniz bulunmuyor."}</Alert>

            <Stack spacing={0.4}>
              <Typography sx={{ fontSize: 13.5, color: "#334155" }}>
                Kullanici: <strong>{user?.username || "-"}</strong>
              </Typography>
              {user?.role ? (
                <Typography sx={{ fontSize: 13.5, color: "#334155" }}>
                  Rol: <strong>{user.role}</strong>
                </Typography>
              ) : null}
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
              <Button variant="contained" onClick={onRetry}>
                Tekrar Dene
              </Button>
              <Button variant="outlined" color="inherit" onClick={onLogout}>
                Cikis Yap
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

