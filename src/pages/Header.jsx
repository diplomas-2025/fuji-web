import React, {useEffect, useState} from "react";
import {Box, Typography, IconButton} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HistoryIcon from "@mui/icons-material/History";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LogoIcon from "@mui/icons-material/LocalDining";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {API_BASE_URL} from "./MainPage"; // You can replace this with your own logo icon

const Header = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")

    useEffect(() => {
        axios.get(API_BASE_URL + "/foods/user/info", {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            setUsername(response.data.username)
        })
    }, [])

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 20px",
                backgroundColor: "#6A1B9A",
                color: "#fff",
                borderRadius: "0 0 8px 8px",
            }}
        >
            {/* Logo and Title */}
            <Box sx={{display: "flex", alignItems: "center", cursor: "pointer"}} onClick={() => navigate("/")}>
                <LogoIcon sx={{fontSize: 40, marginRight: 1}}/>
                <Typography variant="h6" sx={{fontWeight: "bold"}}>
                    Фуджи
                </Typography>
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                <IconButton sx={{color: "#fff"}} onClick={() => {
                    navigate("/cart")
                }}>
                    <ShoppingCartIcon/>
                </IconButton>
                <IconButton sx={{color: "#fff"}} onClick={() => {
                    navigate("/orders")
                }}>
                    <HistoryIcon/>
                </IconButton>

                <Typography variant="h6" sx={{fontWeight: "bold"}}>
                    {username}
                </Typography>

                <IconButton sx={{color: "#fff"}} onClick={() => {
                    localStorage.removeItem("access_token")
                    navigate("/");
                    window.location.reload();
                }}>
                    <ExitToAppIcon/>
                </IconButton>
            </Box>
        </Box>
    );
};

export default Header;