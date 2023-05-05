import React, { useContext, useEffect, useState } from 'react'
import './AgriStore.css'
import Button from 'react-bootstrap/esm/Button'
import Product from './Product'
import StoreContext from '../../../context/StoreContext'
import { Cart } from './Cart'
import CustomImageLoader from 'react-custom-image-loader.'
import grains from '../../../assets/icons/grain.png'
import { useSearchParams } from 'react-router-dom'
import { useUser } from '../../../context/UserContext'
import SideBar from './SideBar'

function AgriStore() {

  const [searchParams, setSearchParams] = useSearchParams()
  const [activeStatus, setActiveStatus] = useState(searchParams.get("category") ? searchParams.get("category") : "all")

  const { showCart, fetchShopContent, shopContent, setContent, shopLoading, handleShow, categories, getCategories, setSkip, setCart } = useContext(StoreContext)
  const { theme } = useUser()

  useEffect(() => {
    // setLoading(true)
    fetchShopContent("", activeStatus)
  }, [activeStatus])

  useEffect(() => {
    getCategories()
    setActiveStatus(searchParams.get("category") ? searchParams.get("category") : "all")
  }, [])



  return (
    <div className={`container p-3 theme-${theme}`}>
      <div className="header">
        {/* <h2 className='display-6'>AgriStore</h2> */}
        {/* <hr className='style-two' /> */}
      </div>
      <div className="agristore-content mt-2 d-flex">
        {/* <div className="options-bar d-flex align-items-center justify-content-between">
          <div className='d-flex align-items-center'>
            <h5>Shop By:&nbsp;&nbsp;</h5>
            <ul className='d-flex list-group list-group-horizontal'>
              {
                categories?.map((category, i) => {
                  return (
                    <li key={i} onClick={(e) => {
                      e.target.classList.add("active")
                      setSearchParams({ category: category.toLowerCase() })
                      setActiveStatus(category.toLowerCase())
                      setContent([])
                      setSkip(0)
                    }} className={`list-group-item ${activeStatus === category.toLowerCase() ? "active" : ""}`}>{category}</li>
                  )
                })
              }
            </ul>
          </div>
          <Cart show={showCart} handleShow={handleShow} shopContent={shopContent} />
        </div> */}

        <SideBar />
        <div>
              <hr className='style-two' />
            <div className="row">
              {
                shopContent?.map((product) => {
                  if (product.category.includes(activeStatus))
                    return (
                      <Product key={product._id} product={product} />
                    )
                })
              }
            </div>
            <Button variant='warning' onClick={() => { fetchShopContent("", activeStatus) }} disabled={shopLoading}>{shopLoading ? "Loading..." : "Load More"}</Button>
            {
              shopLoading ?
                <div className='d-flex w-100 justify-content-center align-items-center'><CustomImageLoader image={grains} animationType={'float'} /></div>
                :
                <></>
            }
        </div>
        
      </div>
    </div>
  )
}

export default AgriStore