import React, { useContext, useEffect, useState } from 'react'
import './AgriStore.css'
import { useUser } from '../../../context/UserContext'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/esm/Button'
import shoppingCart from '../../../assets/icons/shopping_cart.svg'
import StoreContext from '../../../context/StoreContext'

export function Cart() {
    const { cart, setCart, showCart, openCart, INR, cartTotal, setCartTotal, cartLoading, deleteCartItem } = useContext(StoreContext)
    const { theme, currentUser } = useUser()

    function handleShow() {
        openCart(!showCart)
    }

    useEffect(() => {

    }, [cart])

    return (
        <>
            {
                !cartLoading ?
                    <>
                        <div className={`cart theme-${theme}`}>
                            <Button variant="warning" onClick={() => { openCart(!showCart) }}><img src={shoppingCart} alt="cart" />&nbsp;<b>({cart.length})</b></Button>
                        </div>
                        <Modal
                            show={showCart}
                            onHide={handleShow}
                            backdrop="static"
                            keyboard={false}
                            size='md'
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Your saved items</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <ul className={`list-group theme-${theme}`}>
                                    {
                                        cart.length == 0 ? <>No items added.</>
                                            :
                                            cart.map((item) => {
                                                const productDetails = item.product
                                                return (
                                                    <li className='list-group-item w-100 d-flex justify-content-between' key={productDetails._id}><Button variant='danger' onClick={() => { setCartTotal(cartTotal - productDetails.price); deleteCartItem(item._id) }}>X</Button><div>{productDetails.title}</div><div>{INR.format(productDetails.price)}</div></li>
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
