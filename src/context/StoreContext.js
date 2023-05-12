import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useUser } from './UserContext'

const StoreContext = React.createContext()

export function StoreContextProvider({ children }) {
    const [skip, setSkip] = useState(0)
    const [shopContent, setContent] = useState([])
    const [shopLoading, setShopLoading] = useState(false)
    const [showCart, openCart] = useState(false)
    const [cartLoading, setCartLoading] = useState(false)
    const [cart, setCart] = useState([])
    const [categories, setCategories] = useState([])
    const [cartTotal, setCartTotal] = useState(0)

    const { currentUser } = useUser()


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

    function addToCart(product) {
        setCart([...cart, { product: product }])
        setCartTotal(cartTotal + product.price)
        saveCart(product._id)
    }

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

    async function saveCart(productId) {
        try {
            const response = await axios.post("/user/cart/", { userId: currentUser, productId: productId })
            if (!response.hasOwnProperty("data")) throw response
            getUserCart()
        } catch (error) {
            console.log(error);
        }
    }

    async function deleteCartItem(itemId) {
        try {
            setCart(cart.filter(item => item._id != itemId))
            const response = await axios.delete("/user/cart/" + itemId)
            if (!response.hasOwnProperty("data")) throw response
        } catch (error) {
            console.log(error);
        }
    }

    async function getUserCart() {
        try {
            setCartLoading(true)
            const response = await axios.get("/user/cart?user=" + currentUser)
            if (response.hasOwnProperty("data")) {
                setCart(response.data.data)
                setCartTotal(response.data.cartTotal)
                setCartLoading(false)
            }
            else throw response
        } catch (error) {
            setCart([])
            console.log(error);
            setCartLoading(false)
        }
    }

    async function createOrder(productId) {
        try {
            const response = await axios.post("/store/order/create", { userId: currentUser, product: productId })
            if(response.hasOwnProperty("data"))
                return response.data.data
            else throw response
        } catch (error) {
            console.log(error.response.data.message);
            return error.response.data
        }
    }

    useEffect(() => {
        setSkip(shopContent.length)
    }, [shopContent])

    useEffect(() => {
        if (currentUser) {
            getUserCart()
        }
    }, [currentUser])


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
        setCartTotal,
        cartLoading,
        deleteCartItem,
        createOrder
    }
    return (
        <StoreContext.Provider value={values}>
            {children}
        </StoreContext.Provider>
    )
}

export default StoreContext