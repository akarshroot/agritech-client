import React, { useContext } from 'react'
import './Product.css'
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
import StoreContext from '../../../context/StoreContext';
import { useUser } from '../../../context/UserContext';

function Product(props) {
    const { theme } = useUser()
    const { addToCart } = useContext(StoreContext)
    const navigate = useNavigate()
    const INR = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    });

    return (
        <div className={`product-container d-flex flex-column justify-content-center theme-${theme} p-3`}>
            <div className="star-product" hidden={!props.product.recent}>Recently Watched</div>
            <div onClick={() => { navigate("/agristore/product/" + props.product._id) }} style={{ backgroundImage: `url(${props.product.imgUrl})` }} alt={props.product.title} className='product-image' />
            <h5 onClick={() => { navigate("/agristore/product/" + props.product._id) }}>{props.product.title}</h5>
            <hr className='style-two' />
            <span>Price: <span className="price">{INR.format(props.product.price).replace("₹", "KCO ")}</span>/-</span>
            <hr className='style-two' />
            <div className="d-flex justify-content-around">
                <Button variant="danger" onClick={() => { addToCart(props.product) }}>Add to cart</Button>
                <Button variant="success">Buy Now</Button>
            </div>
        </div>
    )
}

export default Product