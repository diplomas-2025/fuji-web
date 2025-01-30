import React from 'react';
import axios from 'axios';

import Card from '../components/Card';
import AppContext from '../context';
import {API_BASE_URL} from "./AuthPage";

function Orders() {
  const { onAddToFavorite, onAddToCart } = React.useContext(AppContext);
  const [orders, setOrders] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(API_BASE_URL + '/foods/orders', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
          }
        });
        setOrders(data);
        setIsLoading(false);
      } catch (error) {
        alert('Ошибка при запросе заказов');
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Мои заказы</h1>
      </div>

      <div className="d-flex flex-wrap">
        {orders.map(item => (
            <div>
              <text style={{}}>{item.address} ({item.status}, {item.date})</text>
              <div style={{height: "30px"}}/>
              <div className="d-flex flex-wrap">
                {item.orders.map((item, index) => (
                    <Card key={index} loading={isLoading} {...item.food} />
                ))}
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
