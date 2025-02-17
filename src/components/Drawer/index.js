import React, {useEffect} from 'react';
import axios from 'axios';

import Info from '../Info';
import { useCart } from '../../hooks/useCart';

import styles from './Drawer.module.scss';
import {API_BASE_URL} from "../../pages/AuthPage";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Drawer({ onClose, onRemove, items = [], opened }) {
  const { cartItems, setCartItems, totalPrice } = useCart();
  const [orderId, setOrderId] = React.useState(null);
  const [isOrderComplete, setIsOrderComplete] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [address, setAddress] = React.useState("")

  const onClickOrder = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(API_BASE_URL + '/foods/order?address=' + address, null, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
      });
      setOrderId(data.id);
      setIsOrderComplete(true);
      setCartItems([]);
    } catch (error) {
      alert('Ошибка при создании заказа :(');
    }
    setIsLoading(false);
  };

  return (
    <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
      <div className={styles.drawer}>
        <h2 className="d-flex justify-between mb-30">
          Корзина <img onClick={onClose} className="cu-p" src="img/btn-remove.svg" alt="Close" />
        </h2>

        {items.length > 0 ? (
            <div className="d-flex flex-column flex">
              <div className="items flex">
                {items.map((obj) => (
                    <div key={obj.id} className="cartItem d-flex align-center mb-20">
                      <div
                          style={{backgroundImage: `url(${obj.image})`}}
                          className="cartItemImg"></div>

                      <div className="mr-20 flex">
                        <p className="mb-5">{obj.title}</p>
                        <b>{obj.price} руб.</b>
                      </div>
                      {/*<img*/}
                      {/*  onClick={() => onRemove(obj.id)}*/}
                      {/*  className="removeBtn"*/}
                      {/*  src="img/btn-remove.svg"*/}
                      {/*  alt="Remove"*/}
                      {/*/>*/}
                    </div>
                ))}
              </div>
              <div className="form-floating">
                <input
                    type="text"
                    className="form-control"
                    id="address"
                    placeholder="Адрес"
                    value={address}
                    onChange={event => setAddress(event.target.value)}
                />
                <label htmlFor="address">Адрес</label>
              </div>
              <div className="cartTotalBlock">
                <ul>
                  <li>
                    <span>Итого:</span>
                    <div></div>
                    <b>{totalPrice} руб. </b>
                  </li>
                  <li>
                    <span>Налог 5%:</span>
                    <div></div>
                    <b>{(totalPrice / 100) * 5} руб. </b>
                  </li>
                </ul>
                <button disabled={isLoading} onClick={onClickOrder} className="greenButton">
                  Оформить заказ <img src="img/arrow.svg" alt="Arrow"/>
                </button>
              </div>
            </div>
        ) : (
            <Info
                title={isOrderComplete ? 'Заказ оформлен!' : 'Корзина пустая'}
                description={
                  isOrderComplete
                      ? `Ваш заказ скоро будет передан курьерской доставке`
                      : 'Добавьте хотя бы одно блюдо, чтобы сделать заказ.'
                }
                image={isOrderComplete ? 'img/complete-order.jpg' : 'img/empty-cart.jpg'}
            />
        )}
      </div>
    </div>
  );
}

export default Drawer;
