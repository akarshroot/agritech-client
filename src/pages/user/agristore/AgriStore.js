import React, { useEffect, useState } from 'react'
import './AgriStore.css'
import { useUser } from '../../../context/UserContext'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/esm/Button'
import shoppingCart from '../../../assets/icons/shopping_cart.svg'
import Product from './Product'

export function Cart({ show, handleShow, shopContent }) {
  const { cart, setCart } = useUser()

  return (
    <Modal
      show={show}
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
            cart?.map((product) => {
              const productDetails = shopContent.find((item)=> {return item._id == product})
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
  )
}

function AgriStore() {

  const [activeStatus, setActiveStatus] = useState("crop")
  const [skip, setSkip] = useState(0)
  const [shopContent, setContent] = useState([])
  const [loading, setLoading] = useState(false)
  const { getShopContent, cart, setCart } = useUser()
  const [showCart, openCart] = useState(false)

  async function fetchShopContent() {
    try {
      const data = await getShopContent(skip)
      if (data.length > 0) {
        setContent([...shopContent, ...data])
      }
    } catch (error) {
      alert(error.message)
    }
  }

  function handleShow() {
    openCart(!showCart)
  }

  useEffect(() => {
    setSkip(shopContent.length)
  }, [shopContent])

  useEffect(() => {
    // setLoading(true)
    fetchShopContent()
  }, [])


  return (
    <div className='agristore-container p-3'>
      <div className="header">
        {/* <h2 className='display-6'>AgriStore</h2> */}
        {/* <hr className='style-two' /> */}
      </div>
      <div className="agristore-content mt-2">
        <div className="options-bar d-flex align-items-center justify-content-between">
          <div className='d-flex align-items-center'>
            <h5>Shop By:&nbsp;&nbsp;</h5>
            <ul className='d-flex list-group list-group-horizontal'>
              <li onClick={(e) => { e.target.classList.add("active"); setActiveStatus("crop") }} className={`list-group-item ${activeStatus == "crop" ? "active" : ""}`}>Crop</li>
              <li onClick={(e) => { e.target.classList.add("active"); setActiveStatus("infra") }} className={`list-group-item ${activeStatus == "infra" ? "active" : ""}`}>Infrastructure</li>
              <li onClick={(e) => { e.target.classList.add("active"); setActiveStatus("service") }} className={`list-group-item ${activeStatus == "service" ? "active" : ""}`}>Service</li>
            </ul>
          </div>
          <div className="cart">
            <Button variant="warning" onClick={() => { openCart(!showCart) }}><img src={shoppingCart} alt="cart" />&nbsp;<b>({cart.length})</b></Button>
          </div>
        </div>
        <hr className='style-two' />
        <div className="category-content">
          {
            shopContent?.map((product) => {
              return (
                <Product key={product._id} {...product} />
              )
            })
          }
        </div>
        <Button variant='warning' onClick={fetchShopContent}>Load More</Button>
      </div>
      <Cart show={showCart} handleShow={handleShow} shopContent={shopContent}/>
    </div>
  )
}

export default AgriStore