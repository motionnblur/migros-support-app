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

export default function App() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    setLoading(true);
    try {
      const result = await window.electronAPI.login({ username, password });

      if (!result.ok) {
        setError(result.error || "Login failed");
        return;
      }

      const { accessToken, user } = result.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      setSuccess(`Login successful. Welcome ${user.username}.`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

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
                Giris yap
              </Typography>
            </Stack>

            {error ? <Alert severity="error">{error}</Alert> : null}
            {success ? <Alert severity="success">{success}</Alert> : null}

            <TextField
              label="Kullanici adi"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              fullWidth
              required
              autoComplete="username"
            />
            <TextField
              label="Sifre"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
              required
              autoComplete="current-password"
            />

            <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
              {loading ? "Giris yapiliyor..." : "Giris"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
