import React, { useContext, useEffect, useState } from 'react'
import './AgriStore.css'
import { useUser } from '../../../context/UserContext'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/esm/Button'
import shoppingCart from '../../../assets/icons/shopping_cart.svg'
import StoreContext from '../../../context/StoreContext'
import CurrencyIconComponent from '../../../assets/widgets/CurrencyIconComponent'
import './Cart.css'
import { useNavigate } from 'react-router-dom'

export function Cart() {
    const { cart, setCart, showCart, openCart, INR, cartTotal, setCartTotal, cartLoading, deleteCartItem } = useContext(StoreContext)
    const { theme, currentUser } = useUser()
    const [URL,changeURL] = useState(false)
    const navigate = useNavigate()

    function handleShow() {
        openCart(!showCart)
    }

    useEffect(() => {

    }, [cart])
    const openProduct=(productDetails)=>{
        changeURL(!URL)
        navigate("/agristore/product/" + productDetails._id,{replace:true}) 
        handleShow() 
    }

    return (
        <>
            {
                !cartLoading ?
                    <>
                        <div className={`cart theme-${theme}`}>
                            <Button variant="warning cart-btn" onClick={() => { openCart(!showCart) }}><img src={shoppingCart} alt="cart" />&nbsp;View Cart <b>({cart.length})</b></Button>
                        </div>
                        <Modal
                            show={showCart}
                            onHide={handleShow}
                            backdrop="static"
                            keyboard={false}
                            size='md'
                        >
                            <Modal.Header closeButton>
                                <Modal.Title><img src={shoppingCart} alt="cart" className='cart-img' /> Your saved items</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <ul className={`list-group theme-${theme}`}>
                                    {
                                        cart.length === 0 ? <>No items added.</>
                                            :
                                            cart.map((item) => {
                                                const productDetails = item.product
                                                return (
                                                        <li className='list-group-item w-100 d-flex justify-content-between align-items-center bg-success bg-opacity-10' key={productDetails._id}>
                                                            <div className='d-flex cart-list' onClick={() => { openProduct(productDetails)}}>
                                                                <img src={productDetails.imgUrl} alt="" width="20%" />
                                                                <div className='m-3'>
                                                                    <h5>{productDetails.title}</h5>
                                                                    {/* {INR.format(productDetails.price)} */}
                                                                    <CurrencyIconComponent size={'25px'} adjustY={'-2px'} /> {productDetails.price} KCO
                                                                </div>
                                                            </div>
                                                            <Button variant='danger' onClick={() => { setCartTotal(cartTotal - productDetails.price); deleteCartItem(item._id) }}>Remove</Button>
                                                        </li>
                                                )
                                            })
                                    }
                                    <li className='list-group-item w-100 d-flex justify-content-between active'><div>Total</div><div>{INR.format(cartTotal)}</div></li>
                                </ul>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleShow}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </>
                    :
                    <>Loading...</>
            }
        </>
    )
}
