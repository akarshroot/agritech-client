import React, { useContext, useRef, useState } from 'react'
import './Product.css'
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
import StoreContext from '../../../context/StoreContext';
import { useUser } from '../../../context/UserContext';
import CurrencyIconComponent from '../../../assets/widgets/CurrencyIconComponent';
import { ToastContainer, toast } from 'react-toastify';
import shoppingCart from '../../../assets/icons/shopping_cart.svg'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

function Product(props) {
    const { theme } = useUser()
    const { addToCart, createOrder } = useContext(StoreContext)
    const navigate = useNavigate()
    const [disableBuy, setDisable] = useState(false)
    const INR = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    });

    async function buyItem(e) {
        e.preventDefault()
        const productId = modalDetails._id
        setDisable(true)
        const res = await createOrder(productId)
        if (res.error === false) {
            toast.success(res.message, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        setDisable(false)
        setShowBuyModal(!openBuyModal)
    }

    const [openBuyModal, setShowBuyModal] = useState(false)
    const [modalDetails, setModalDetails] = useState({})
    const passwordRef = useRef()
    function handleBuyModal() {
        setShowBuyModal(!openBuyModal)
    }

    return (
        <>
    <div className='col-md-6 col-xl-3 p-3'>
        <div className={`product-container h-100 shadow row flex-column justify-content-center theme-${theme} p-3`}>
            <div className="star-product" hidden={!props.product.recent}>Recently Watched</div>
            <div onClick={() => { navigate("/agristore/product/" + props.product._id) }} style={{ backgroundImage: `url(${props.product.imgUrl})` }} alt={props.product.title} className='product-image' />
            <h5 onClick={() => { navigate("/agristore/product/" + props.product._id) }}>{props.product.title}</h5>
            <hr className='style-two' />
            <span>Price: <CurrencyIconComponent size='30' adjustY={'-10%'} /><span className="price">{INR.format(props.product.price).replace("₹", "KCO ")}</span>/-</span>
            <hr className='style-two' />
            
            
            <div  className='overlay-box'>
                <div className='inner d-flex justify-content-center align-items-center'>
                    <div className="d-flex justify-content-around flex-column">
                        <div>
                            <Button variant="warning w-100" onClick={() => { addToCart(props.product) }}><img src={shoppingCart} alt='' /> Add To Cart</Button>
                        </div>
                        <div className='my-4'>
                            <Button variant="success p-2 w-100" onClick={buyItem}>Buy Now</Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    </>
    )
}

export default Product