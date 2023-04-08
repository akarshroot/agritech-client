import React, { useContext, useEffect, useState } from 'react'
import './AgriStore.css'
import { useUser } from '../../../context/UserContext'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/esm/Button'
import shoppingCart from '../../../assets/icons/shopping_cart.svg'
import StoreContext from '../../../context/StoreContext'

export function Cart() {
    const { cart, setCart, showCart, openCart, shopContent } = useContext(StoreContext)

    function handleShow() {
        openCart(!showCart)
    }

    return (
        <>
            <div className="cart">
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
                    <ul className='list-group'>
                        {
                            cart.length == 0 ? <>No items added.</>
                            :
                            cart.map((product) => {
                                const productDetails = shopContent.find((item) => {return item._id == product })
                                return (
                                    <li className='list-group-item' key={product}>{productDetails.title}</li>
                                )
                            })
                        }
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleShow}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
