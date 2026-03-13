import React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography
} from "@mui/material";

export default function LoginView({ username, password, loading, error, onUsernameChange, onPasswordChange, onSubmit }) {
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
          <Stack spacing={3} component="form" onSubmit={onSubmit}>
            <Stack spacing={1}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Giris
              </Typography>
            </Stack>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <TextField
              label="Kullanici adi"
              type="text"
              value={username}
              onChange={(event) => onUsernameChange(event.target.value)}
              fullWidth
              required
              autoComplete="username"
            />
            <TextField
              label="Sifre"
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              fullWidth
              required
              autoComplete="current-password"
            />

            <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
              {loading ? "Giris yapiliyor..." : "Giris yap"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}