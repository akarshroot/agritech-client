import React, { useContext, useEffect, useState } from 'react'
import { useUser } from '../../../context/UserContext'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import './ProductDetails.css'
import Button from 'react-bootstrap/esm/Button'
import shoppingCart from '../../../assets/icons/shopping_cart.svg'
import StoreContext from '../../../context/StoreContext'
import { Cart } from './Cart'
import CustomImageLoader from 'react-custom-image-loader.'
import grains from '../../../assets/icons/grain.png'
import CurrencyIconComponent from '../../../assets/widgets/CurrencyIconComponent'
import StarRating from './StarRating'

function ProductDetails(props) {

    const [productData, setProductData] = useState()
    const [loading, setLoading] = useState(false)
    const [productId, setProductId] = useState()

    const { showCart, shopContent, setContent, handleShow, getProductData, addToCart, INR } = useContext(StoreContext)


    const params = useParams()
    const navigate = useNavigate()
    const location = useLocation()

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
    }, [location])

    console.log(productData)
    return (
        <div className='row flex-column align-items-start w-100 p-3'>
            <div className="product-details-header d-flex justify-content-between">
                <Button onClick={() => navigate("/agrineeds",{replace:true})} variant='warning'>&larr;&nbsp;Back to Store</Button>
                <Cart show={showCart} handleShow={handleShow} shopContent={shopContent} />
            </div>
            {productData ? <>
                <div className="row p-3 product-details-container d-flex justify-content-center justify-content-around">
                    <div className="product-details-img p-3 col-12 col-sm-12 col-md-4" >
                        <img loading='lazy' src={productData.imgUrl} alt="" width="70%" />
                    </div>
                    <div className="product-details col-12 col-sm-12 col-md-5 d-flex flex-column align-items-start p-3 m-3">
                        <div className="category-path mb-3">PRODUCTS / {productData.category.map((category,i) => (category !== "all" || productData.category.length === 1) && (<Link key={'specificProductLink'+productData._id+i} className='link' to={`/agrineeds?category=${category}`}>{category.toUpperCase()}</Link>))}</div>
                        <h3 className="product-title">{productData.title}</h3>
                        <div className="product-description mt-3 text-left">
                            {productData.description}
                        </div>
                        <span>Sold By: {productData.soldBy}</span>

                        <div className="w-100">
                            <hr />
                        </div>
                        <h3><CurrencyIconComponent size='35' adjustY={'-5%'}/>{INR.format(productData.price).replace("₹", "KCO ")}</h3>

                        <div className='d-flex justify-content-between w-50'>
                        <span>Quantity: {productData.availableQuantity} </span>
                        <StarRating rating={productData.rating} />
                        </div>

                        <div className="d-flex justify-content-around mt-3">
                            <Button variant="outline-danger" onClick={() => { addToCart(productData) }}>Add to cart</Button>
                            &nbsp;
                            &nbsp;
                            
                            <Button variant="success btn-buy floating">Buy Now</Button>
                        </div>
                    </div>
                </div>
            </> : <div className='d-flex w-100 vh-100 justify-content-center align-items-center'><CustomImageLoader image={grains} animationType={'float'}/></div>}
        </div>
    )
}

export default ProductDetails