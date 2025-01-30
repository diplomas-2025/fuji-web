import React, { useState } from "react";
import axios from "axios";
import {
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Box
} from "@mui/material";

export const API_BASE_URL = "https://spotdiff.ru/fuji-api";

const AuthPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorText, setErrorText] = useState("");

    async function auth() {
        setErrorText("");

        if (username === "" || password === "") {
            setErrorText("Заполните все поля");
        } else {
            try {
                const response = await axios.post(API_BASE_URL + "/foods/login", {
                    username,
                    password,
                });
                localStorage.setItem("access_token", response.data.accessToken);
                window.location.reload();
            } catch (e) {
                console.error(e);
                setErrorText("Ошибка входа. Проверьте данные.");
            }
        }
    }

    async function reg() {
        setErrorText("");

        if (username === "" || password === "") {
            setErrorText("Заполните все поля");
        } else {
            try {
                const response = await axios.post(API_BASE_URL + "/foods/register", {
                    username,
                    password,
                });
                localStorage.setItem("access_token", response.data.accessToken);
                window.location.reload();
            } catch (e) {
                console.error(e);
                setErrorText("Ошибка регистрации. Попробуйте снова.");
            }
        }
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1E1B4B, #3E1E68, #6A1B9A)",
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={10}
                    sx={{
                        padding: 5,
                        borderRadius: 3,
                        textAlign: "center",
                        backdropFilter: "blur(10px)",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                    }}
                >
                    <img src="/img/logo.png" alt="Фуджи" style={{ width: "80px", height: "80px" }} />
                    <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "#fff" }}>
                        Фуджи
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: "#ccc", mb: 2 }}>
                        Вход в личный кабинет
                    </Typography>

                    {errorText && (
                        <Typography color="error" sx={{ marginTop: 2 }}>
                            {errorText}
                        </Typography>
                    )}

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 3 }}>
                        <TextField
                            label="Почта"
                            variant="filled"
                            fullWidth
                            InputProps={{
                                sx: {
                                    borderRadius: 2,
                                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                                    color: "#fff",
                                    "&::placeholder": { color: "#bbb" },
                                },
                            }}
                            InputLabelProps={{ sx: { color: "#bbb" } }}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <TextField
                            label="Пароль"
                            type="password"
                            variant="filled"
                            fullWidth
                            InputProps={{
                                sx: {
                                    borderRadius: 2,
                                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                                    color: "#fff",
                                    "&::placeholder": { color: "#bbb" },
                                },
                            }}
                            InputLabelProps={{ sx: { color: "#bbb" } }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={auth}
                            sx={{
                                bgcolor: "#6A1B9A",
                                color: "#fff",
                                borderRadius: 2,
                                padding: 1.5,
                                fontSize: "1rem",
                                transition: "0.3s",
                                boxShadow: "0px 4px 15px rgba(106, 27, 154, 0.5)",
                                border: "2px solid rgba(255, 255, 255, 0.5)", // Белая полупрозрачная граница
                                "&:hover": {
                                    bgcolor: "#5A1489",
                                    boxShadow: "0px 0px 20px rgba(106, 27, 154, 0.8)",
                                    border: "2px solid rgba(255, 255, 255, 0.8)", // Граница становится ярче при наведении
                                },
                            }}
                        >
                            Войти
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={reg}
                            sx={{
                                color: "#fff",
                                borderColor: "#fff",
                                borderRadius: 2,
                                padding: 1.5,
                                fontSize: "1rem",
                                transition: "0.3s",
                                "&:hover": {
                                    bgcolor: "rgba(255, 255, 255, 0.2)",
                                    borderColor: "#ddd",
                                },
                            }}
                        >
                            Создать аккаунт
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default AuthPage;