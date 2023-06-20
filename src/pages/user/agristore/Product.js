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
import {RatingStars} from './ProductDetails';

function Product(props) {
    const { theme } = useUser()
    const { addToCart, createOrder } = useContext(StoreContext)
    const navigate = useNavigate()
    const [disableBuy, setDisable] = useState(false)
    const INR = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    });

    const [openBuyModal, setShowBuyModal] = useState(false)
    const [modalDetails, setModalDetails] = useState({})
    const passwordRef = useRef()
    function handleBuyModal() {
        setShowBuyModal(!openBuyModal)
    }


    async function buyItem(e) {
        e.preventDefault()
        const productId = modalDetails._id
        setDisable(true)
        const res = await createOrder(productId, passwordRef.current.value)
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

    console.log(props.product)

    return (
        <>
            <div className='col-md-6 col-xl-3 p-2'>
                <Modal
                    show={openBuyModal}
                    onHide={handleBuyModal}
                    backdrop="static"
                    keyboard={false}
                    size='md'
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Buy {modalDetails.title} for {modalDetails.price} KCO</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={buyItem} className='form-control'>
                            <div className='d-flex flex-column justify-content-center align-items-center'>
                                <fieldset className='m-1'>
                                    <label htmlFor='passwordToPurchase'>Password</label><br />
                                    <input id='passwordToPurchase' type='password' ref={passwordRef} required={true} />
                                </fieldset>
                                <div className="alert alert-warning">
                                    This action would deduct {modalDetails.price} KCO from your wallet.
                                </div>
                            </div>
                            <div className='text-end'>
                                <Button className='mx-2' variant="danger" onClick={handleBuyModal}>
                                    Cancel
                                </Button>
                                <Button className='my-3' type='submit' variant="success" disabled={disableBuy} >{disableBuy ? "Ordering..." : "Confirm Purchase"}</Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>

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
                <div className={`product-container h-100 shadow row flex-column justify-content-center theme-${theme} py-3`}>
                    <div className="star-product" hidden={!props.product.recent}>Recently Watched</div>
                    <div onClick={() => { navigate("/agristore/product/" + props.product._id) }} style={{ backgroundImage: `url(${props.product.imgUrl})` }} alt={props.product.title} className='product-image' />
                    <h5 onClick={() => { navigate("/agristore/product/" + props.product._id) }}>{props.product.title}</h5>
                    <hr className='style-two' />
                    <span>Price:<CurrencyIconComponent size='30' adjustY={'-10%'} /><span className="price">{INR.format(props.product.price).replace("₹", "KCO ")}</span>/-</span>
                    <hr className='style-two' />
                    <div>
                        <RatingStars rating={props.product.rating} />
                    </div>

                    <div className='overlay-box'>
                        <div className='inner d-flex justify-content-center align-items-center'>
                            <div className="d-flex justify-content-around flex-column">
                                <div>
                                    <Button variant="primary w-100" onClick={() => { addToCart(props.product) }}><img src={shoppingCart} alt='' /> Add To Cart</Button>
                                </div>
                                <div className='my-4'>
                                    <Button variant="success p-2 w-100" onClick={() => {setModalDetails(props.product); setShowBuyModal(!openBuyModal)}}>{disableBuy ? "Ordering..." : "Buy Now"}</Button>
                                </div>
                                <Button variant="outline-success w-100" onClick={() => { navigate("/agristore/product/" + props.product._id) }}>View Details</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Product