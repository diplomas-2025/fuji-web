import React, {useState, useEffect} from "react";
import axios from "axios";
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
    Divider,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export const API_BASE_URL = "https://spotdiff.ru/fuji-api";

const FoodPage = () => {
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(1); // Default selected category
    const [openDialog, setOpenDialog] = useState(false); // Dialog open state
    const [selectedFood, setSelectedFood] = useState(null); // Selected food for dialog

    const [favorited, setFavorited] = useState(false)

    // Fetch food items from the API
    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const response = await axios.get(API_BASE_URL + '/foods?categoryId=' + selectedCategoryId, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    }
                })
                setFoods(response.data);
            } catch (error) {
                console.error("Error fetching foods:", error);
            }
        };
        fetchFoods().then();
    }, [selectedCategoryId]); // Refetch foods whenever the selected category changes

    // Fetch categories from the API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(API_BASE_URL + '/foods/categories', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    }
                })
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories().then();
    }, []);

    // Handle category selection
    const handleCategorySelect = (categoryId) => {
        setSelectedCategoryId(categoryId);
    };

    // Handle food item click
    const handleFoodClick = (food) => {
        setSelectedFood(food);
        setOpenDialog(true);
    };

    // Handle dialog close
    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedFood(null); // Clear the selected food when closing the dialog
    };

    const onAddToFavorite = (food) => {
        if (!food.favorited) {
            axios.post(API_BASE_URL + '/foods/' + food.id + '/favorite', null, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then(() => {
                setFoods(prevFoods =>
                    prevFoods.map(item =>
                        item.id === food.id ? {...item, favorited: true} : item
                    )
                );
            })
        } else {
            axios.delete(API_BASE_URL + '/foods/' + food.id + '/favorite', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then(() => {
                setFoods(prevFoods =>
                    prevFoods.map(item =>
                        item.id === food.id ? {...item, favorited: false} : item
                    )
                );
            })
        }
    }

    const onAddToCart = (food) => {
        axios.post(API_BASE_URL + "/foods/" + food.id + "/card?count=1", null, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(() => {
            setFoods(prevFoods =>
                prevFoods.map(item =>
                    item.id === food.id ? {...item, cardCount: 1} : item
                )
            );
        })
    }

    const onDecreaseQuantity = (food) => {
        if (food.cardCount <= 1) {
            axios.delete(API_BASE_URL + "/foods/" + food.id + "/card", {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then(() => {
                setFoods(prevFoods =>
                    prevFoods.map(item =>
                        item.id === food.id ? {...item, cardCount: 0} : item
                    )
                );
            })
        }else {
            axios.post(API_BASE_URL + "/foods/card/count?foodId=" + food.id + "&count=" + (food.cardCount - 1), null, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then(() => {
                setFoods(prevFoods =>
                    prevFoods.map(item =>
                        item.id === food.id ? {...item, cardCount: food.cardCount - 1} : item
                    )
                );
            })
        }
    }

    const onIncreaseQuantity = (food) => {
        axios.post(API_BASE_URL + "/foods/card/count?foodId=" + food.id + "&count=" + (food.cardCount + 1), null, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(() => {
            setFoods(prevFoods =>
                prevFoods.map(item =>
                    item.id === food.id ? {...item, cardCount: food.cardCount + 1} : item
                )
            );
        })
    }

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
                        margin: "50px"
                    }}
                >
                    <Typography variant="h4" component="h1" sx={{fontWeight: "bold", color: "#fff"}}>
                        Фуджи
                    </Typography>
                    <Typography variant="h7" component="h4" sx={{color: "#fff", marginTop: 1}}>
                        Доставка еды
                    </Typography>

                    {/* Horizontal list of categories */}
                    <Box sx={{marginTop: 2, overflowX: "auto", paddingBottom: 2}}>
                        <Box sx={{display: "flex", gap: 2}}>

                            <Button
                                sx={{
                                    backgroundColor: favorited ? "#5A1489" : "#6A1B9A", // Highlight selected category
                                    color: "#fff",
                                    borderRadius: "20px",  // More rounded corners
                                    padding: "10px 20px", // Larger padding for better touch area
                                    fontSize: "1rem", // Slightly larger font size
                                    boxShadow: favorited ? "0px 4px 12px rgba(0, 0, 0, 0.2)" : "none", // Shadow for selected button
                                    border: favorited ? "2px solid #fff" : "none", // White border for selected category
                                    "&:hover": {
                                        backgroundColor: "#5A1489", // Hover effect
                                    },
                                    transition: "background-color 0.3s ease, box-shadow 0.3s ease, border 0.3s ease", // Smooth transition
                                }}
                                onClick={() => setFavorited(!favorited)}
                            >
                                <IconButton sx={{color: favorited ? "#ff4081" : "#bbb"}}
                                            onClick={() => setFavorited(!favorited)}>
                                    <FavoriteIcon/>
                                </IconButton>
                            </Button>

                            {categories.map((category) => (
                                <Button
                                    key={category.id}
                                    sx={{
                                        backgroundColor: selectedCategoryId === category.id ? "#5A1489" : "#6A1B9A", // Highlight selected category
                                        color: "#fff",
                                        borderRadius: "20px",  // More rounded corners
                                        padding: "10px 20px", // Larger padding for better touch area
                                        fontSize: "1rem", // Slightly larger font size
                                        boxShadow: selectedCategoryId === category.id ? "0px 4px 12px rgba(0, 0, 0, 0.2)" : "none", // Shadow for selected button
                                        border: selectedCategoryId === category.id ? "2px solid #fff" : "none", // White border for selected category
                                        "&:hover": {
                                            backgroundColor: "#5A1489", // Hover effect
                                        },
                                        transition: "background-color 0.3s ease, box-shadow 0.3s ease, border 0.3s ease", // Smooth transition
                                    }}
                                    onClick={() => handleCategorySelect(category.id)}
                                >
                                    {category.name}
                                </Button>
                            ))}
                        </Box>
                    </Box>

                    <Grid container spacing={3} sx={{marginTop: 3}}>
                        {foods.filter((food) => !favorited || food.favorited).map((food) => (
                            <Grid item xs={12} sm={6} md={4} key={food.id}>
                                <Card
                                    sx={{
                                        borderRadius: 3,
                                        overflow: "hidden",
                                        backdropFilter: "blur(10px)",
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => handleFoodClick(food)} // Открытие диалога с информацией о продукте
                                >
                                    <CardMedia
                                        component="img"
                                        alt={food.title}
                                        image={food.image}
                                        sx={{
                                            height: 270, // Фиксированная высота
                                            objectFit: "cover", // Обеспечивает покрытие контейнера без искажений
                                            width: "100%",
                                        }}
                                    />
                                    <CardContent sx={{color: "#fff"}}>
                                        <Typography variant="h6">{food.title}</Typography>
                                        <Typography variant="body2" sx={{color: "#bbb"}}>
                                            {food.description}
                                        </Typography>
                                        <Typography variant="body2" sx={{color: "#bbb"}}>
                                            {food.allergens}
                                        </Typography>
                                        <Typography variant="body2" sx={{color: "#fff", fontWeight: "bold"}}>
                                            {food.price} ₽
                                        </Typography>
                                    </CardContent>

                                    {/* Блок с кнопками и информацией */}
                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: 1,
                                        alignItems: "center"
                                    }}>
                                        {/* Кнопка "Избранное" */}
                                        <IconButton
                                            sx={{color: food.favorited ? "#ff4081" : "#bbb"}}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onAddToFavorite(food);
                                            }}
                                        >
                                            <FavoriteIcon/>
                                        </IconButton>

                                        {/* Если товар уже в корзине, показываем кнопки "-" и "+" */}
                                        {food.cardCount > 0 ? (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: 1,
                                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                                    borderRadius: 2,
                                                    padding: "4px 8px",
                                                }}
                                            >
                                                <IconButton
                                                    sx={{
                                                        color: "#fff",
                                                        backgroundColor: "#6A1B9A",
                                                        minWidth: "30px",
                                                        minHeight: "30px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        "&:hover": { backgroundColor: "#5A1489" },
                                                    }}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        onDecreaseQuantity(food);
                                                    }}
                                                >
                                                    <RemoveIcon fontSize="small" />
                                                </IconButton>

                                                <Typography variant="body1" sx={{ color: "#fff", fontWeight: "bold", minWidth: "20px", textAlign: "center" }}>
                                                    {food.cardCount}
                                                </Typography>

                                                <IconButton
                                                    sx={{
                                                        color: "#fff",
                                                        backgroundColor: "#6A1B9A",
                                                        minWidth: "30px",
                                                        minHeight: "30px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        "&:hover": { backgroundColor: "#5A1489" },
                                                    }}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        onIncreaseQuantity(food);
                                                    }}
                                                >
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ) : (
                                            // Если товара нет в корзине, показываем просто иконку корзины
                                            <IconButton
                                                sx={{color: "#bbb"}}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    onAddToCart(food);
                                                }}
                                            >
                                                <ShoppingCartIcon/>
                                            </IconButton>
                                        )}
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                {/* Modern Dialog to display food details */}
                <Dialog
                    open={openDialog}
                    onClose={handleDialogClose}
                    sx={{
                        "& .MuiDialogContainer-root": {
                            borderRadius: "16px",  // Add rounded corners to the dialog container
                        },
                        "& .MuiDialog-paper": {
                            borderRadius: "16px",  // Add rounded corners to the paper element inside the dialog
                        }
                    }}
                >
                    <DialogTitle
                        sx={{
                            backgroundColor: "#6A1B9A",
                            color: "#fff",
                            padding: "16px 24px",
                            fontWeight: "bold",
                            textAlign: "center",
                            borderTopLeftRadius: "12px",
                            borderTopRightRadius: "12px",
                        }}
                    >
                        {selectedFood ? selectedFood.title : "Загрузка..."}
                    </DialogTitle>

                    <DialogContent
                        sx={{
                            backgroundColor: "#fff",
                            padding: 3,
                            borderRadius: "12px",
                            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                            color: "#333",
                            minWidth: "300px", // Prevents content from shrinking too much on small screens
                        }}
                    >
                        {selectedFood ? (
                            <>
                                <Box sx={{marginBottom: 2}}>
                                    <CardMedia
                                        component="img"
                                        alt={selectedFood.title}
                                        height="200"
                                        image={selectedFood.image}
                                        sx={{
                                            borderRadius: "12px",
                                            objectFit: "contain",  // Change from "cover" to "contain" to avoid cropping
                                            width: "100%",         // Ensure image stretches fully within the container
                                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                            marginBottom: 2,
                                        }}
                                    />
                                </Box>
                                <Typography variant="body1" sx={{fontWeight: "bold", marginBottom: 1}}>
                                    {selectedFood.description}
                                </Typography>
                                <Divider sx={{marginBottom: 2}}/>
                                <Typography variant="body2" sx={{marginBottom: 1}}>
                                    <strong>Цена:</strong> {selectedFood.price} ₽
                                </Typography>
                                <Typography variant="body2" sx={{marginBottom: 1}}>
                                    <strong>Вес:</strong> {selectedFood.grams} г
                                </Typography>
                                <Typography variant="body2" sx={{marginBottom: 1}}>
                                    <strong>Аллергены:</strong> {selectedFood.allergens || "Нет данных"}
                                </Typography>
                                {selectedFood.cardCount > 0 && (
                                    <Typography variant="body2"
                                                sx={{color: "#5C6BC0", fontWeight: "bold", marginTop: 2}}>
                                        В корзине: {selectedFood.cardCount} шт.
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <Typography variant="body2">Загрузка...</Typography>
                        )}
                    </DialogContent>
                    <DialogActions
                        sx={{
                            padding: "8px 24px",
                            backgroundColor: "#f5f5f5",
                            borderBottomLeftRadius: "12px",
                            borderBottomRightRadius: "12px",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            onClick={handleDialogClose}
                            sx={{
                                color: "#6A1B9A",
                                fontWeight: "bold",
                                borderRadius: "20px",
                                padding: "8px 20px",
                                "&:hover": {
                                    backgroundColor: "#6A1B9A",
                                    color: "#fff",
                                },
                                transition: "all 0.3s ease",
                            }}
                        >
                            Закрыть
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default FoodPage;