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

  // exp is in seconds since epoch
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
        <Typography>Session kontrol ediliyor...</Typography>
      </Box>
    );
  }

  if (isAuthenticated) {
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
            <Stack spacing={2}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Dashboard
              </Typography>
              <Alert severity="success">Hos geldin, {currentUser?.username}.</Alert>
              <Typography variant="body2" color="text.secondary">
                Bu ekran korumali bir alandir. Gecerli token oldugu surece gorunur.
              </Typography>
              <Button variant="outlined" onClick={() => logout()}>
                Cikis yap
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
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
                Giris yap
              </Typography>
            </Stack>

            {error ? <Alert severity="error">{error}</Alert> : null}

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
