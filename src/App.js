import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer';
import AppContext from './context';

import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';
import {API_BASE_URL} from "./pages/AuthPage";

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [cartResponse, favoritesResponse, itemsResponse] = await Promise.all([
          axios.get(API_BASE_URL + '/foods/cards', {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
          }),
          axios.get(API_BASE_URL + '/foods/favorites', {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
          }),
          axios.get(API_BASE_URL + '/foods', {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
          }),
        ]);

        setIsLoading(false);
        setCartItems(cartResponse.data);
        setFavorites(favoritesResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        alert('Ошибка при запросе данных ;(');
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id));
      if (findItem) {
        setCartItems((prev) => prev.filter((item) => Number(item.parentId) !== Number(obj.id)));
        await axios.delete(API_BASE_URL + `/foods/${findItem.id}/card`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
          }
        });
      } else {
        setCartItems((prev) => [...prev, obj]);
        const { data } = await axios.post(API_BASE_URL + `/foods/${obj.id}/card`, null, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
          }
        });
        setCartItems((prev) =>
          prev.map((item) => {
            if (item.parentId === data.parentId) {
              return {
                ...item,
                id: data.id,
              };
            }
            return item;
          }),
        );
      }
    } catch (error) {
      alert('Ошибка при добавлении в корзину');
      console.error(error);
    }
  };

  const onRemoveItem = (id) => {
    try {
      axios.delete(API_BASE_URL + `/foods/${id}/favorite`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
      });
      setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
    } catch (error) {
      alert('Ошибка при удалении из корзины');
      console.error(error);
    }
  };

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
        axios.delete(API_BASE_URL + `/foods/${obj.id}/favorite`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
          }
        });
        setFavorites((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
      } else {
        const { data } = await axios.post(
            API_BASE_URL + `/foods/${obj.id}/favorite`,
            obj,
            {
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
            }
        );
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты');
      console.error(error);
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  };

  return (
    <AppContext.Provider
      value={{
        items,
        cartItems,
        favorites,
        isItemAdded,
        onAddToFavorite,
        onAddToCart,
        setCartOpened,
        setCartItems,
      }}>
      <BrowserRouter>
        <div className="wrapper clear">
          <Drawer
              items={cartItems}
              onClose={() => setCartOpened(false)}
              onRemove={onRemoveItem}
              opened={cartOpened}
          />

          <Header onClickCart={() => setCartOpened(true)}/>

          <Routes>
            <Route path="/" element={
              <Home
                  items={items}
                  cartItems={cartItems}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  onChangeSearchInput={onChangeSearchInput}
                  onAddToFavorite={onAddToFavorite}
                  onAddToCart={onAddToCart}
                  isLoading={isLoading}
              />
            }/>

            <Route path="/favorites" element={
              <Favorites/>
            }/>

            <Route path="/orders" element={
              <Orders/>
            }/>
          </Routes>

        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
