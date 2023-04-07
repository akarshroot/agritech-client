import React from 'react'
import './Product.css'
import { useUser } from '../../../context/UserContext';
import Button from 'react-bootstrap/esm/Button';

function Product({ title, imgUrl, price, soldBy, availableQuantity, _id, ...props }) {
    const { theme, setCart, cart } = useUser()
    const INR = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    });

    function addToCart() {
        setCart([...cart, _id])
    }

    return (
        <div className={`product-container d-flex flex-column theme-${theme}`}>
            <div style={{ backgroundImage: `url(${imgUrl})` }} alt={title} className='product-image' />
            <h5>{title}</h5>
            <hr className='style-two' />
            <span>Price: <span className="price">{INR.format(price)}</span>/-</span>
            <hr className='style-two' />
            <div className="d-flex justify-content-around">
                <Button variant="danger" onClick={addToCart}>Add to cart</Button>
                <Button variant="success">Buy Now</Button>
            </div>
        </div>
    )
}

export default Product