import React, { useContext, useEffect, useState } from 'react'
import { useUser } from '../../../context/UserContext'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './ProductDetails.css'
import Button from 'react-bootstrap/esm/Button'
import shoppingCart from '../../../assets/icons/shopping_cart.svg'
import StoreContext from '../../../context/StoreContext'
import { Cart } from './Cart'
import CustomImageLoader from 'react-custom-image-loader.'
import grains from '../../../assets/icons/grain.png'

function ProductDetails(props) {

    const [productData, setProductData] = useState()
    const [loading, setLoading] = useState(false)
    const [productId, setProductId] = useState()

    const { showCart, shopContent, setContent, handleShow, getProductData, addToCart, INR } = useContext(StoreContext)


    const params = useParams()
    const navigate = useNavigate()


    async function fetchProductDetails(prodId) {
        try {
            setLoading(true)
            const data = await getProductData(prodId)
            setProductData(data)
            data.recent = true
            setContent([data])
            setLoading(false)
        } catch (error) {
            alert(error.message)
            setLoading(false)
        }
    }

    useEffect(() => {
        const productId = params.id
        setProductId(productId)
        fetchProductDetails(productId)
    }, [])

    return (
        <div className='d-flex flex-column align-items-start w-100 p-3'>
            <div className="product-details-header d-flex justify-content-between w-100">
                <Button onClick={() => navigate("/agristore",{replace:true})} variant='warning'>&larr;&nbsp;Back to Store</Button>
                <Cart show={showCart} handleShow={handleShow} shopContent={shopContent} />
            </div>
            {productData ? <>
                <div className="d-flex p-3 product-details-container w-100">
                    <div className="product-details-img w-50 p-3" style={{ backgroundImage: `url(${productData.imgUrl})` }}></div>
                    <div className="product-details d-flex flex-column align-items-start p-3 m-3">
                        <div className="category-path mb-3">PRODUCTS / {productData.category.map((category,i) => (category !== "all" || productData.category.length === 1) && (<Link key={'specificProductLink'+productData._id+i} className='link' to={`/agristore?category=${category}`}>{category.toUpperCase()}</Link>))}</div>
                        <h3 className="product-title">{productData.title}</h3>
                        <span>Sold By: {productData.soldBy}</span><span>Rating: {productData.rating}/5</span>
                        <div className="w-100">
                            <hr />
                        </div>
                        <h3>{INR.format(productData.price).replace("₹", "KCO ")}</h3>
                        <span>Quantity: {productData.quantity && productData.quantity}</span>
                        <div className="d-flex justify-content-around mt-3">
                            <Button variant="danger" onClick={() => { addToCart(productData) }}>Add to cart</Button>
                            &nbsp;
                            &nbsp;
                            <Button variant="success">Buy Now</Button>
                        </div>
                        <div className="product-description mt-3">
                            {productData.description}
                        </div>
                    </div>
                </div>
            </> : <div className='d-flex w-100 vh-100 justify-content-center align-items-center'><CustomImageLoader image={grains} animationType={'float'}/></div>}
        </div>
    )
}

export default ProductDetails