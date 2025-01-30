import React from 'react';
import {
    Card as MuiCard,
    CardMedia,
    CardContent,
    IconButton,
    Typography,
    Button,
    Box,
    CircularProgress,
    useTheme,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useContext } from 'react';
import AppContext from '../../context';

function Card({
                  id,
                  title,
                  image,
                  price,
                  onFavorite,
                  onPlus,
                  favorited = false,
                  loading = false,
              }) {
    const theme = useTheme();
    const { isItemAdded } = useContext(AppContext);
    const [isFavorite, setIsFavorite] = React.useState(favorited);
    const obj = { id, parentId: id, title, image, price };

    const onClickPlus = () => {
        onPlus(obj);
    };

    const onClickFavorite = () => {
        onFavorite(obj);
        setIsFavorite(!isFavorite);
    };

    return (
        <MuiCard
            sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: 5,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: `0 8px 20px rgba(0, 0, 0, 0.2)`,
                },
                backgroundColor: theme.palette.background.paper,
                cursor: "pointer"
            }}
        >
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
                    <CircularProgress sx={{ color: theme.palette.primary.main }} />
                </Box>
            ) : (
                <>
                    <Box sx={{ position: 'relative' }}>
                        <CardMedia
                            component="img"
                            height="250"
                            image={image}
                            alt={title}
                            sx={{
                                borderRadius: '8px',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.1)',
                                },
                            }}
                        />
                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                borderRadius: '50%',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                            }}
                            onClick={onClickFavorite}
                        >
                            {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                        </IconButton>
                    </Box>
                    <CardContent sx={{ padding: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 500, color: '#333', fontSize: 18 }} gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', fontSize: 14 }}>
                            Цена: <strong>{price} руб.</strong>
                        </Typography>
                        {onPlus && (
                            <Button
                                variant="contained"
                                color={isItemAdded(id) ? 'secondary' : 'primary'}
                                onClick={onClickPlus}
                                sx={{
                                    marginTop: 2,
                                    borderRadius: 20,
                                    padding: '8px 16px',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    '&:hover': { backgroundColor: isItemAdded(id) ? '#bdbdbd' : '#00796b' },
                                }}
                            >
                                {isItemAdded(id) ? 'В корзине' : 'Добавить в корзину'}
                            </Button>
                        )}
                    </CardContent>
                </>
            )}
        </MuiCard>
    );
}

export default Card;