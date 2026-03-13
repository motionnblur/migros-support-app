import React from "react";
import { Box, Typography } from "@mui/material";
import LoginView from "./components/auth/LoginView";
import AccessDeniedView from "./components/auth/AccessDeniedView";
import SupportWorkspace from "./components/workspace/SupportWorkspace";
import { buildErrorText, clearStoredAuth, getStoredUser, isTokenValid } from "./utils/auth";

export default function App() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [sessionLoading, setSessionLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [accessToken, setAccessToken] = React.useState("");
  const [accessDeniedMessage, setAccessDeniedMessage] = React.useState("");
  const [error, setError] = React.useState("");

  const logout = React.useCallback((message = "") => {
    clearStoredAuth();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAccessToken("");
    setAccessDeniedMessage("");
    setPassword("");
    if (message) {
      setError(message);
      return;
    }

    setError("");
  }, []);

  const handleAccessDenied = React.useCallback((message = "") => {
    setAccessDeniedMessage(message || "Bu islem icin gerekli destek yetkiniz bulunmuyor.");
    setError("");
  }, []);

  React.useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = getStoredUser();

    if (isTokenValid(token) && user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      setAccessToken(token || "");
      setAccessDeniedMessage("");
      setError("");
    } else {
      clearStoredAuth();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setAccessToken("");
      setAccessDeniedMessage("");
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
        logout("Oturum suresi doldu. Lutfen tekrar giris yapin.");
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, logout]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setAccessDeniedMessage("");

    setLoading(true);
    try {
      const result = await window.electronAPI.login({ username, password });

      if (!result.ok) {
        setError(buildErrorText(result));
        return;
      }

      const { accessToken: token, user } = result.data;
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      setAccessToken(token);
      setIsAuthenticated(true);
      setCurrentUser(user);
      setAccessDeniedMessage("");
      setPassword("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Giris basarisiz");
    } finally {
      setLoading(false);
    }
  };

  const handleRetryAccess = React.useCallback(() => {
    if (!isTokenValid(accessToken)) {
      logout("Oturum suresi doldu. Lutfen tekrar giris yapin.");
      return;
    }

    setAccessDeniedMessage("");
  }, [accessToken, logout]);

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
        <Typography>Oturum kontrol ediliyor...</Typography>
      </Box>
    );
  }

  if (isAuthenticated && accessDeniedMessage) {
    return (
      <AccessDeniedView
        user={currentUser}
        message={accessDeniedMessage}
        onRetry={handleRetryAccess}
        onLogout={() => logout()}
      />
    );
  }

  if (isAuthenticated) {
    return (
      <SupportWorkspace
        currentUser={currentUser}
        logout={logout}
        accessToken={accessToken}
        onAccessDenied={handleAccessDenied}
      />
    );
  }

  return (
    <LoginView
      username={username}
      password={password}
      loading={loading}
      error={error}
      onUsernameChange={setUsername}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
    />
  );
}

