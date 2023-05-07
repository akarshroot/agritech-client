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
    <div className={`container-fluid theme-${theme}`}>
      <div className='row'>
          <SideBar />
          <div className='col-md-9' >
            <div className="row">
          <Cart show={showCart} handleShow={handleShow} shopContent={shopContent} />
              {
                shopContent?.map((product) => {
                  if (product.category.includes(activeStatus))
                    return (
                      <Product key={product._id} product={product} />
                    )
                })
              }
            </div>
            <Button variant='warning my-3' onClick={() => { fetchShopContent("", activeStatus) }} disabled={shopLoading}>{shopLoading ? "Loading..." : "Load More"}</Button>
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