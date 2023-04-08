import axios from 'axios'
import React, { useEffect, useState } from 'react'

const StoreContext = React.createContext()

export function StoreContextProvider({ children }) {
    const [skip, setSkip] = useState(0)
    const [shopContent, setContent] = useState([])
    const [shopLoading, setShopLoading] = useState(false)
    const [showCart, openCart] = useState(false)
    const [cart, setCart] = useState([])
    const [categories, setCategories] = useState([])
    const [cartTotal, setCartTotal] = useState(0)


    const INR = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    });

    async function fetchShopContent(e, category) {
        try {
            setShopLoading(true)
            const data = await getShopContent(skip, category)
            if (data.length > 0) {
                setContent([...shopContent, ...data])
            }
            setShopLoading(false)
        } catch (error) {
            alert(error.message)
            setShopLoading(false)
        }
    }

    async function getCategories() {
        try {
            setShopLoading(true)
            const response = await axios.get("/store/category/")
            if (response.hasOwnProperty("data")) {
                setShopLoading(false)
                setCategories(response.data.data)
            }
            else {
                setShopLoading(false)
                throw response.data
            }
        } catch (error) {
            alert(error.message)
            setShopLoading(false)
        }
    }

    function handleShow() {
        openCart(!showCart)
    }

    function addToCart(_id, price) {
        setCart([...cart, _id])
        setCartTotal(cartTotal + price)
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
        addToCart,
        shopLoading,
        getCategories,
        categories,
        INR,
        cartTotal,
    }
    return (
        <StoreContext.Provider value={values}>
            {children}
        </StoreContext.Provider>
    )
}

export default StoreContext