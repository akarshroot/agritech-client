import React, { useContext } from 'react'
import './Product.css'
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
import StoreContext from '../../../context/StoreContext';
import { useUser } from '../../../context/UserContext';

function Product({ title, imgUrl, price, soldBy, availableQuantity, _id, ...props }) {
    const { theme } = useUser()
    const { addToCart } = useContext(StoreContext)
    const navigate = useNavigate()
    const INR = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    });

    return (
        <div className={`product-container d-flex flex-column theme-${theme}`}>
            <div onClick={() => { navigate("/agristore/product/" + _id) }} style={{ backgroundImage: `url(${imgUrl})` }} alt={title} className='product-image' />
            <h5 onClick={() => { navigate("/agristore/product/" + _id) }}>{title}</h5>
            <hr className='style-two' />
            <span>Price: <span className="price">{INR.format(price)}</span>/-</span>
            <hr className='style-two' />
            <div className="d-flex justify-content-around">
                <Button variant="danger" onClick={() => { addToCart(_id) }}>Add to cart</Button>
                <Button variant="success">Buy Now</Button>
            </div>
        </div>
    )
}

export default Product