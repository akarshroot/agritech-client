import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import axios from 'axios'
// import { io } from 'socket.io-client'
// import { SOCKET_URL as socketURL } from './config'

const UserContext = React.createContext()

export function useUser() {
    return useContext(UserContext)
}

export function UserProvider({ children }) {

    //Theme Preference
    const isBrowserDefaulDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [theme, setTheme] = useState(isBrowserDefaulDark() ? 'dark' : 'light')

    //User Data
    const cookies = Cookies; //constructor method deprecated
    const [currentUser, setCurrentUser] = useState(cookies.get("isLoggedIn"))

    const [userData, setUserData] = useState({
        imgUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
        name: "Test User",
        region: "Punjab",
        landArea: "9 acre",
        crop: "Wheat",
        // walletAddress: "0x2ee4961905E3c9B6eC890d5F919224Ad6BD87637"
        // walletAddress: "0xbe48d73a8244dcdaa359be58caba27e8cde0d280"
        walletAddress: "0x879005ce3b64a880e1512d759cecb1bd857590f8"
    })

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    ////////////////////////////////////////////////////////////
    //////////////////////////AUTH FUNCTIONS START HERE//////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////

    async function login(credentials) {
        try {
            const user = await new Promise((resolve, reject) => {
                if (credentials.email === "admin@test.com" && credentials.password === "admin") setTimeout(() => {
                    setCurrentUser(true)
                    cookies.set("isLoggedIn", "true")
                    resolve(true)
                }, 3000)
                else setTimeout(() => reject(new Error("Invalid Credentials")), 3000)
            })
            setCurrentUser(user)
            navigate("/dashboard")
        } catch (error) {
            throw error
        }
    }

    async function logout() {
        try {
            setCurrentUser(false)
            cookies.remove("isLoggedIn")
        } catch (error) {
            console.error(error.message);
        }
        navigate("/")
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////AUTH FUNCTIONS END HERE//////////////////////////////
    ////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////
    //////////////////////////WIDGET FUNCTIONS START HERE//////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////

    async function getActiveCampaign() {
        try {
            const { data } = await axios.post("/user/campaigns/active", { userId: currentUser })
            return data.campaign
        } catch (error) {
            throw error
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////WIDGET FUNCTIONS END HERE//////////////////////////////
    ////////////////////////////////////////////////////////////


    useEffect(() => {

    }, []);


    const value = {
        currentUser,
        userData,
        theme,
        setTheme,
        logout,
        login,
        getActiveCampaign
    }
    return (
        <UserContext.Provider value={value}>
            {!loading && children}
        </UserContext.Provider>
    )
}