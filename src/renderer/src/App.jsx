import React from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    Link,
    Stack,
    TextField,
    Typography
} from "@mui/material";

export default function App() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [rememberMe, setRememberMe] = React.useState(true);

    const handleSubmit = (event) => {
        event.preventDefault();
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
            <Card sx={{width: "100%", maxWidth: 420}}>
                <CardContent sx={{p: 4}}>
                    <Stack spacing={3} component="form" onSubmit={handleSubmit}>
                        <Stack spacing={1}>
                            <Typography variant="h4" sx={{fontWeight: 700}}>
                                Giriş yap
                            </Typography>
                        </Stack>

                        <TextField
                            label="Kullanıcı adı"
                            type="text"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            fullWidth
                            required
                            autoComplete="email"
                        />
                        <TextField
                            label="Şifre"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            fullWidth
                            required
                            autoComplete="current-password"
                        />

                        <Button type="submit" variant="contained" size="large" fullWidth>
                            Giriş
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
