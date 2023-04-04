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
    const checkTokenCookie = cookies.get("isLoggedIn");
    const [currentUser, setCurrentUser] = useState()

    // const [userData, setUserData] = useState({
    //     imgUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
    //     name: "Test User",
    //     region: "Punjab",
    //     landArea: "9 acre",
    //     crop: "Wheat",
    //     // walletAddress: "0x2ee4961905E3c9B6eC890d5F919224Ad6BD87637"
    //     // walletAddress: "0xbe48d73a8244dcdaa359be58caba27e8cde0d280"
    //     walletAddress: "0x879005ce3b64a880e1512d759cecb1bd857590f8"
    // })
    const [userData, setUserData] = useState()

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    ////////////////////////////////////////////////////////////
    //////////////////////////AUTH FUNCTIONS START HERE//////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////

    async function signup(data) {
        try {
            const response = await axios.post("auth/signup", data, { withCredentials: true })
            if (response.hasOwnProperty("data")) {
                console.log(response.data);
            } else throw response
            // setLoading(false)
        } catch (error) {
            // setLoading(false)
            throw error.response.data.message
        }
    }



    async function login(credentials) {
        try {
            const response = await axios.post("auth/login", credentials)
            if (response.hasOwnProperty("data")) {
                console.log(response.data);
            } else {
                console.log(response);
                throw response
            }
            axios.defaults.headers.common['Authorization'] = `${response.data['accessToken']}`
            setCurrentUser(response.data.userId)
            navigate("/dashboard")
        } catch (error) {
            console.log(error.response.data.message);
            throw error.response.data.message
        }
        // try {
        //     const user = await new Promise((resolve, reject) => {
        //         if (credentials.email == "admin@test.com" && credentials.password == "admin") setTimeout(() => {
        //             setCurrentUser(true)
        //             cookies.set("isLoggedIn", "true")
        //             resolve(true)
        //         }, 3000)
        //         else setTimeout(() => reject(new Error("Invalid Credentials")), 3000)
        //     })
        //     setCurrentUser(user)
        //     navigate("/dashboard")
        // } catch (error) {
        //     throw error
        // }
    }

    async function logout() {
        try {
            setCurrentUser(false)
            cookies.remove("isLoggedIn")
            cookies.remove("refreshToken")
            //delete token api call
            await axios.delete("/refreshToken")
            setUserData()
        } catch (error) {
            console.error(error.message);
        }
        navigate("/")
    }

    async function checkToken() {
        setLoading(true)
        const { data } = await axios.post("refreshToken", {})
        console.log("Checking refreshtoken " + cookies.get("isLoggedIn") + "-----", data);
        if (data.error == false) {
            setCurrentUser(data.userId)
            axios.defaults.headers.common['Authorization'] = `${data['accessToken']}`
            setLoading(false)
            console.log(cookies.get("isLoggedIn"));
            return true
        }
        else {
            logout()
            setLoading(false)
            return false
        }
    };

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

    ////////////////////////////////////////////////////////////
    //////////////////////////USER FUNCTIONS START HERE//////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////

    async function getUserData() {
        try {
            setLoading(true)
            if (!currentUser) return
            const response = await axios.post("/user/data", { userId: currentUser })
            if (response.hasOwnProperty("data")) {
                console.log(response.data);
                setUserData(response.data.data)
            } else {
                console.log(response);
                throw response
            }
        } catch (error) {
            throw error
        }
        setLoading(false)
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////USER FUNCTIONS END HERE//////////////////////////////
    ////////////////////////////////////////////////////////////

    useEffect(() => {
        if (checkTokenCookie)
            checkToken();
        else setLoading(false)
        console.log(checkTokenCookie);
        // if(currentUser) getUserData(currentUser)
    }, [checkTokenCookie]);


    const value = {
        loading,
        currentUser,
        userData,
        theme,
        setTheme,
        logout,
        login,
        signup,
        getActiveCampaign,
        checkTokenCookie,
        getUserData
    }
    return (
        <UserContext.Provider value={value}>
            {
                loading ? <>Loading...</>
                    :
                    children
            }
            {/* {!loading && children} */}
        </UserContext.Provider>
    )
}