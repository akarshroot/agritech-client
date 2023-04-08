import axios from 'axios'
import React, { useEffect, useState } from 'react'

const StoreContext = React.createContext()

export function StoreContextProvider({ children }) {
    const [skip, setSkip] = useState(0)
    const [shopContent, setContent] = useState([])
    const [showCart, openCart] = useState(false)
    const [cart, setCart] = useState([])

    async function fetchShopContent() {
        try {
            const data = await getShopContent(skip)
            if (data.length > 0) {
                setContent([...shopContent, ...data])
            }
        } catch (error) {
            alert(error.message)
        }
    }

    function handleShow() {
        openCart(!showCart)
    }

    function addToCart(_id) {
        setCart([...cart, _id])
    }

    useEffect(() => {
        setSkip(shopContent.length)
    }, [shopContent])
    

    async function getShopContent(skip, category) {
        const response = await axios.get("/store/products/all?skip=" + skip + `${category ? "&category=" + category : ""}`)
        if (response.hasOwnProperty("data"))
            return response.data.data
        else throw response.data.data

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

    const values = {
        fetchShopContent,
        getProductData,
        cart,
        setCart,
        skip,
        setSkip,
        handleShow,
        openCart,
        showCart,
        shopContent,
        setContent,
        addToCart
    }
    return (
        <StoreContext.Provider value={values}>
            {children}
        </StoreContext.Provider>
    )
}

export default StoreContext