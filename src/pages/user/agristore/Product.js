import React, { useContext, useState } from 'react'
import './Product.css'
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
import StoreContext from '../../../context/StoreContext';
import { useUser } from '../../../context/UserContext';
import CurrencyIconComponent from '../../../assets/widgets/CurrencyIconComponent';
import { ToastContainer, toast } from 'react-toastify';

function Product(props) {
    const { theme } = useUser()
    const { addToCart, createOrder } = useContext(StoreContext)
    const navigate = useNavigate()
    const [disableBuy, setDisable] = useState(false)
    const INR = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    });

    async function buyItem(productId) {
        setDisable(true)
        const res = await createOrder(productId)
        setDisable(false)
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
    }

    return (
        <div className='col-sm-6 col-md-4 col-xl-3'>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="light"
            />
            <div className={`product-container d-flex flex-column justify-content-center theme-${theme} p-3`}>
                <div className="star-product" hidden={!props.product.recent}>Recently Watched</div>
                <div onClick={() => { navigate("/agristore/product/" + props.product._id) }} style={{ backgroundImage: `url(${props.product.imgUrl})` }} alt={props.product.title} className='product-image' />
                <h5 onClick={() => { navigate("/agristore/product/" + props.product._id) }}>{props.product.title}</h5>
                <hr className='style-two' />
                <span>Price: <CurrencyIconComponent size='30' adjustY={'-10%'} /><span className="price">{INR.format(props.product.price).replace("₹", "KCO ")}</span>/-</span>
                <hr className='style-two' />
                <div className="d-flex justify-content-around">
                    <Button variant="danger" onClick={() => { addToCart(props.product) }}>Add to cart</Button>
                    <Button variant="success" onClick={() => buyItem(props.product._id)} disabled={disableBuy}>{disableBuy ? "Ordering..." : "Buy Now"}</Button>
                </div>
            </div>
        </div>
    )
}

export default Product