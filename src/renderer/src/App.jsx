import React from "react";
import { Box, Button, Card, CardContent, Container, Stack, Typography } from "@mui/material";

export default function App() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(1200px circle at 10% 10%, #dbe7ff 0%, #f6f8ff 35%, #fefefe 70%)",
        color: "#0b1b3a"
      }}
    >
      <Container sx={{ py: 6 }} maxWidth="md">
        <Stack spacing={3} alignItems="flex-start">
          <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 700 }}>
            Electron + React + Material UI
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Your desktop app is ready.
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 560 }}>
            This is a clean starting point with Electron powered by Vite, React on the renderer, and MUI for
            components. Customize the theme, add windows, and ship.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="contained" size="large">
              Launch Feature
            </Button>
            <Button variant="outlined" size="large">
              View Docs
            </Button>
          </Stack>
          <Card sx={{ width: "100%" }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Quick sanity check
              </Typography>
              <Typography variant="body2" color="text.secondary">
                If you can see this card, React is rendering and MUI styles are loading.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
