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
    IconButton,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import {ShoppingCart as ShoppingCartIcon, Delete as DeleteIcon} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import {API_BASE_URL} from "./MainPage";
import {useNavigate} from "react-router-dom";

const CartPage = () => {
    const navigate = useNavigate()

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = () => {
        axios.get(API_BASE_URL + "/foods/cards", {
            headers: {Authorization: "Bearer " + localStorage.getItem("access_token")},
        }).then(response => setCartItems(response.data));
    };

    const updateCartItem = (foodId, count) => {
        if (count === 0) {
            axios.delete(API_BASE_URL + "/foods/" + foodId + "/card", {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then(() => {
                setCartItems(prevItems => prevItems.filter(item => item.id !== foodId));
            })
        } else {
            axios.post(API_BASE_URL + "/foods/card/count?foodId=" + foodId + "&count=" + count, null, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then(() => {
                setCartItems(prevFoods =>
                    prevFoods.map(item =>
                        item.id === foodId ? {...item, cardCount: count} : item
                    )
                );
            })
        }
    };

    const clearCart = () => {
        axios.delete(`${API_BASE_URL}/foods/card`, {
            headers: {Authorization: "Bearer " + localStorage.getItem("access_token")},
        }).then(() => {
            setCartItems([])
        });
    };

    const [openOrderDialog, setOpenOrderDialog] = useState(false);
    const [address, setAddress] = useState({
        city: "",
        street: "",
        house: "",
        apartment: "",
        phone: "",
    });

    const handleOrderDialogClose = () => setOpenOrderDialog(false);
    const handleOrderDialogOpen = () => setOpenOrderDialog(true);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setAddress((prevState) => ({...prevState, [name]: value}));
    };

    const handlePlaceOrder = () => {
        axios.post(API_BASE_URL + `/foods/order?city=${address.city}&street=${address.street}&house=${address.house}&apartment=${address.apartment}&phoneNumber=${address.phone}`, null, {
            headers: {Authorization: "Bearer " + localStorage.getItem("access_token")},
        }).then(() => {
            handleOrderDialogClose();
            navigate("/orders")
        })
    };

    // Считаем сумму корзины
    const sum = cartItems.reduce((total, item) => total + (item.price * item.cardCount), 0);

    return (
        <Box sx={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
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
                    <Typography variant="h4" sx={{fontWeight: "bold", color: "#fff"}}>Корзина</Typography>
                    <Typography variant="body1" sx={{color: "#fff", marginTop: 1}}>Ваши товары</Typography>

                    {cartItems.length > 0 ? (
                        <>
                            <Grid container spacing={3} sx={{marginTop: 3}}>
                                {cartItems.map((item) => (
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
                                                alt={item.title}
                                                image={item.image}
                                                sx={{
                                                    height: 270,
                                                    objectFit: "cover",
                                                    width: "100%",
                                                }}
                                            />
                                            <CardContent sx={{color: "#fff"}}>
                                                <Typography variant="h6">{item.title}</Typography>
                                                <Typography variant="body2"
                                                            sx={{color: "#bbb"}}>{item.description}</Typography>
                                                <Typography variant="body2"
                                                            sx={{color: "#bbb"}}>{item.allergens}</Typography>
                                                <Typography variant="body2" sx={{color: "#fff", fontWeight: "bold"}}>
                                                    {item.price} ₽
                                                </Typography>

                                                <Box sx={{display: "flex", alignItems: "center", gap: 1, marginTop: 2}}>
                                                    <IconButton
                                                        sx={{
                                                            color: "#fff",
                                                            backgroundColor: "#6A1B9A",
                                                            width: "30px",
                                                            height: "30px",
                                                            "&:hover": {backgroundColor: "#5A1489"},
                                                        }}
                                                        onClick={() => updateCartItem(item.id, Math.max(item.cardCount - 1, 0))}
                                                    >
                                                        <RemoveIcon fontSize="small"/>
                                                    </IconButton>
                                                    <Typography variant="body1" sx={{
                                                        color: "#fff",
                                                        fontWeight: "bold",
                                                        minWidth: "20px",
                                                        textAlign: "center"
                                                    }}>
                                                        {item.cardCount}
                                                    </Typography>
                                                    <IconButton
                                                        sx={{
                                                            color: "#fff",
                                                            backgroundColor: "#6A1B9A",
                                                            width: "30px",
                                                            height: "30px",
                                                            "&:hover": {backgroundColor: "#5A1489"},
                                                        }}
                                                        onClick={() => updateCartItem(item.id, item.cardCount + 1)}
                                                    >
                                                        <AddIcon fontSize="small"/>
                                                    </IconButton>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            <Box sx={{display: "flex", justifyContent: "space-between", marginTop: 3}}>

                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#6A1B9A",
                                        color: "#fff",
                                        padding: "10px 20px",
                                        borderRadius: "20px",
                                        fontWeight: "bold",
                                        "&:hover": {backgroundColor: "#5A1489"},
                                    }}
                                    onClick={handleOrderDialogOpen}
                                >
                                    Оформить заказ <ShoppingCartIcon sx={{marginLeft: 1}}/>
                                </Button>

                                <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold"}}>
                                    Итого: {sum} ₽
                                </Typography>

                                <Button
                                    variant="outlined"
                                    startIcon={<DeleteIcon/>}
                                    sx={{
                                        color: "#fff",
                                        borderColor: "#fff",
                                        padding: "10px 20px",
                                        borderRadius: "20px",
                                        fontWeight: "bold",
                                        "&:hover": {
                                            backgroundColor: "#ff4444",
                                            borderColor: "#ff4444",
                                            color: "#fff",
                                        },
                                    }}
                                    onClick={clearCart}
                                >
                                    Очистить корзину
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Typography variant="h6" sx={{color: "#fff", textAlign: "center", marginTop: 3}}>
                            Ваша корзина пуста
                        </Typography>
                    )}
                </Paper>

                {/* Order Dialog */}
                <Dialog open={openOrderDialog} onClose={handleOrderDialogClose}>
                    <DialogTitle sx={{backgroundColor: "#6A1B9A", color: "#fff", padding: "16px 24px"}}>
                        Оформление заказа
                    </DialogTitle>
                    <DialogContent sx={{backgroundColor: "#fff", padding: 3}}>
                        <TextField
                            fullWidth
                            label="Город"
                            variant="outlined"
                            margin="normal"
                            name="city"
                            value={address.city}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            label="Улица"
                            variant="outlined"
                            margin="normal"
                            name="street"
                            value={address.street}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            label="Дом"
                            variant="outlined"
                            margin="normal"
                            name="house"
                            value={address.house}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            label="Квартира"
                            variant="outlined"
                            margin="normal"
                            name="apartment"
                            value={address.apartment}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            label="Номер телефона"
                            variant="outlined"
                            margin="normal"
                            name="phone"
                            value={address.phone}
                            onChange={handleInputChange}
                        />
                    </DialogContent>
                    <DialogActions sx={{padding: "8px 24px", backgroundColor: "#f5f5f5"}}>
                        <Button onClick={handleOrderDialogClose}
                                sx={{color: "#6A1B9A", fontWeight: "bold"}}>Отмена</Button>
                        <Button onClick={handlePlaceOrder}
                                sx={{color: "#fff", backgroundColor: "#6A1B9A", fontWeight: "bold"}}>Оформить</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default CartPage;