import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Badge, Box, useTheme } from '@mui/material';
import { useCart } from '../hooks/useCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';

function Header(props) {
    const { totalPrice } = useCart();
    const theme = useTheme();

    return (
        <AppBar
            position="sticky"
            sx={{
                backgroundColor: theme.palette.background.default,
                boxShadow: 4,
                borderRadius: '0 0 16px 16px',  // Добавлен радиус на нижнюю часть
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', textDecoration: 'none', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img width={40} height={40} src="img/logo.png" alt="Logotype" />
                        <Box sx={{ marginLeft: 2 }}>
                            <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
                                Фуджи
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                Доставка еды
                            </Typography>
                        </Box>
                    </Box>
                </Link>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        onClick={props.onClickCart}
                        sx={{
                            color: theme.palette.text.primary,
                            transition: 'transform 0.2s ease',
                            '&:hover': { transform: 'scale(1.1)' },
                            borderRadius: '50%', // Радиус для иконок
                        }}
                    >
                        <Badge badgeContent={totalPrice ? totalPrice : 0} color="error">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>

                    <Link to="/favorites">
                        <IconButton
                            sx={{
                                color: theme.palette.text.primary,
                                marginLeft: 2,
                                transition: 'transform 0.2s ease',
                                '&:hover': { transform: 'scale(1.1)' },
                                borderRadius: '50%', // Радиус для иконок
                            }}
                        >
                            <FavoriteIcon />
                        </IconButton>
                    </Link>

                    <Link to="/orders">
                        <IconButton
                            sx={{
                                color: theme.palette.text.primary,
                                marginLeft: 2,
                                transition: 'transform 0.2s ease',
                                '&:hover': { transform: 'scale(1.1)' },
                                borderRadius: '50%', // Радиус для иконок
                            }}
                        >
                            <PersonIcon />
                        </IconButton>
                    </Link>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;