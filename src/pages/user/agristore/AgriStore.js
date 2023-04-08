import React, { useContext, useEffect, useState } from 'react'
import './AgriStore.css'
import { useUser } from '../../../context/UserContext'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/esm/Button'
import shoppingCart from '../../../assets/icons/shopping_cart.svg'
import Product from './Product'
import StoreContext from '../../../context/StoreContext'
import { Cart } from './Cart'

function AgriStore() {

  const [activeStatus, setActiveStatus] = useState("crop")

  const { showCart, fetchShopContent, shopContent, setContent, handleShow } = useContext(StoreContext)

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
          <Cart show={showCart} handleShow={handleShow} shopContent={shopContent} />
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
    </div>
  )
}

export default AgriStore