import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';
import 'macro-css';

import AuthPage from "./pages/AuthPage";
import FoodPage from "./pages/MainPage";
import Header from "./pages/Header";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import CartPage from "./pages/CartPage";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            { localStorage.getItem('access_token') &&
                <Header/>
            }

            <Routes>
                { localStorage.getItem('access_token') ?
                    <>
                        <Route path="/" element={<FoodPage/>}/>
                        <Route path="/cart" element={<CartPage/>}/>
                        <Route path="/orders" element={<OrderHistoryPage/>}/>

                        <Route path="*" element={<Navigate to="/" />} />
                    </> :
                    <>
                        <Route path="/login" element={<AuthPage/>}/>
                        <Route path="*" element={<Navigate to="/login" />} />
                    </>
                }
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root'),
);
