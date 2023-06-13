/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import axios from 'axios'
// import { io } from 'socket.io-client'
// import { SOCKET_URL as socketURL } from './config'
import CustomImageLoader from 'react-custom-image-loader.'
import grains from '../assets/icons/grain.png'
import Loader from '../assets/loader/Loader'

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
    const [userData, setUserData] = useState()
    const [adminData, setAdminData] = useState()
    const [userCampaigns, setUserCampaigns] = useState()
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
        const response = await axios.post("refreshToken", {})
        if (response.hasOwnProperty("data")) {
            const data = response.data
            console.log("Checking refreshtoken " + cookies.get("isLoggedIn") + "-----", data);
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


    async function getAdminData() {
        try {
            const response = await axios.post("/user/admin/data", { userId: currentUser })
            if (response.hasOwnProperty("data")) {
                setAdminData(response.data.data)
                return response.data
            }
            else throw response
        } catch (error) {
            return error.response.data
        }
    }

    async function verifyUserEmail(otp) {
        try {
            const response = await axios.post("/auth/otp/verify", { userId: currentUser, code: otp })
            if(response.hasOwnProperty("data")) {
                return response.data
            }
            else throw response
        } catch (error) {
            return error.response.data
        }
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

    ////////////////////////////////////////////////////////////
    //////////////////////////USER FUNCTIONS START HERE//////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////

    async function getUserData() {
        try {
            // if(!loading)
            //     // setLoading(true)
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
        // setLoading(false)
    }

    async function getUserCampaigns() {
        try {
            // if(!loading)
                // setLoading(true)
            if (!currentUser) return
            const response = await axios.post("/user/campaigns", { userId: currentUser })
            if (response.hasOwnProperty("data")) {
                console.log(response.data)
                setUserCampaigns(response.data.data)
            } else {
                console.log(response)
                throw response
            }
        } catch (error) {
            throw error
        }
        // setLoading(false)
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////USER FUNCTIONS END HERE//////////////////////////////
    ////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////
    //////////////////////////WALLET FUNCTIONS START HERE//////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////

    async function getOrderId(purchaseData) {
        try {
            const response = await axios.post("/wallet/order/create", purchaseData)
            if (response.data.error) {
                return response.data
            }
            if (response.hasOwnProperty("data"))
                return response.data.data
            else throw response
        } catch (error) {
            console.log(error);
        }
    }

    async function verifyPayment(paymentData) {
        try {
            const response = await axios.post("/wallet/payment/verify", paymentData)
            if (response.hasOwnProperty("data"))
                return response.data.data
            else throw response
        } catch (error) {
            console.log(error);
        }
    }

    async function getProductData(prodId) {
        try {
            const response = await axios.get("/store/products/" + prodId)
            if (response.hasOwnProperty("data")) {
                console.log(response.data)
                return response.data.data
            } else {
                console.log(response)
                throw response
            }
        } catch (error) {
            throw error
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////WALLET FUNCTIONS END HERE//////////////////////////////
    ////////////////////////////////////////////////////////////

    useEffect(() => {
        if (checkTokenCookie)
            checkToken();
        console.log(checkTokenCookie);
        // if(!userData) getUserData()
    }, [checkTokenCookie]);


    const value = {
        loadingUser: loading,
        currentUser,
        userData,
        theme,
        setTheme,
        logout,
        login,
        signup,
        getActiveCampaign,
        checkTokenCookie,
        getUserData,
        getUserCampaigns,
        userCampaigns,
        getOrderId,
        verifyPayment,
        getAdminData,
        adminData,
        verifyUserEmail
    }
    return (
        <UserContext.Provider value={value}>
            {
                loading ? <> <div className='d-flex w-100 vh-100 justify-content-center align-items-center'><Loader height="300px" width="300px"></Loader></div></>
                    :
                    children
            }
            {/* {!loading && children} */}
        </UserContext.Provider>
    )
}