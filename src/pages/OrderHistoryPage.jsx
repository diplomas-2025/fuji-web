import React, {useEffect, useState} from "react";
import {
    Container,
    Typography,
    Paper,
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import {API_BASE_URL} from "./AuthPage";

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);

    const getStatusText = (status) => {
        switch (status) {
            case "PROCESS":
                return "В обработке";
            case "COMPLETED":
                return "Завершен";
            case "CANCELLED":
                return "Отменен";
            default:
                return "Неизвестный статус";
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "PROCESS":
                return "warning";
            case "COMPLETED":
                return "success";
            case "CANCELLED":
                return "error";
            default:
                return "default";
        }
    };

    useEffect(() => {
        axios.get(API_BASE_URL + "/foods/orders", {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            setOrders(response.data)
        })
    }, [])

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Container maxWidth="lg">
                <Paper
                    elevation={10}
                    sx={{
                        padding: 5,
                        borderRadius: 3,
                        backdropFilter: "blur(10px)",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        margin: "50px",
                    }}
                >
                    <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "#fff" }}>
                        История заказов
                    </Typography>

                    {orders.map((order) => (
                        <Accordion key={order.id} sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)", marginTop: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
                                <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                    <Typography variant="h6" sx={{ color: "#fff" }}>
                                        Заказ №{order.id} ({order.date})
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#bbb" }}>
                                        Адрес: {order.city}, {order.street}, д. {order.house}, кв. {order.apartment}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#bbb" }}>
                                        Телефон: {order.phoneNumber}
                                    </Typography>
                                    <Chip
                                        label={getStatusText(order.status)}
                                        color={getStatusColor(order.status)}
                                        sx={{ marginTop: 1, width: 120 }}
                                    />
                                </Box>
                            </AccordionSummary>

                            <AccordionDetails>
                                <Grid container spacing={3}>
                                    {order.orders.map((item) => (
                                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                                            <Card
                                                sx={{
                                                    borderRadius: 3,
                                                    overflow: "hidden",
                                                    backdropFilter: "blur(10px)",
                                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    alt={item.food.title}
                                                    image={item.food.image}
                                                    sx={{
                                                        height: 270,
                                                        objectFit: "cover",
                                                        width: "100%",
                                                    }}
                                                />
                                                <CardContent sx={{ color: "#fff" }}>
                                                    <Typography variant="h6">{item.food.title}</Typography>
                                                    <Typography variant="body2" sx={{ color: "#bbb" }}>
                                                        {item.food.description}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: "#bbb" }}>
                                                        Аллергены: {item.food.allergens}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: "#fff", fontWeight: "bold" }}>
                                                        {item.food.price} ₽
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: "#bbb" }}>
                                                        Количество: {item.count}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Paper>
            </Container>
        </Box>
    );
};

export default OrderHistoryPage;