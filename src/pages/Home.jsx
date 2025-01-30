import React from 'react';
import {Box, Typography, TextField, IconButton, Grid} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Card from '../components/Card';

function Home({
                  items,
                  searchValue,
                  setSearchValue,
                  onChangeSearchInput,
                  onAddToFavorite,
                  onAddToCart,
                  isLoading,
              }) {
    const renderItems = () => {
        const filteredItems = items.filter((item) =>
            item.title.toLowerCase().includes(searchValue.toLowerCase())
        );
        return (isLoading ? [...Array(8)] : filteredItems).map((item, index) => (
            <Grid item key={index} xs={8} sm={4} md={3} lg={2.5}>
                <Card
                    onFavorite={(obj) => onAddToFavorite(obj)}
                    onPlus={(obj) => onAddToCart(obj)}
                    loading={isLoading}
                    {...item}
                />
            </Grid>
        ));
    };

    return (
        <Box sx={{padding: 4, maxWidth: '100%', backgroundColor: '#f5f5f5'}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
                <Typography variant="h4" sx={{fontWeight: 600, color: '#333'}}>
                    {searchValue ? `Поиск по запросу: "${searchValue}"` : 'Меню'}
                </Typography>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <TextField
                        value={searchValue}
                        onChange={onChangeSearchInput}
                        placeholder="Поиск..."
                        variant="outlined"
                        size="small"
                        sx={{
                            marginRight: 2,
                            backgroundColor: 'white',
                            borderRadius: 3,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                '& fieldset': {borderColor: '#c4c4c4'},
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <SearchIcon sx={{color: '#777'}}/>
                            ),
                            endAdornment: searchValue && (
                                <IconButton onClick={() => setSearchValue('')}>
                                    <ClearIcon sx={{color: '#777'}}/>
                                </IconButton>
                            ),
                        }}
                    />
                </Box>
            </Box>
            <Grid container spacing={4}>{renderItems()}</Grid>
        </Box>
    );
}

export default Home;