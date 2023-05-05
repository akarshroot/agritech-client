import React, {useContext, useEffect, useState} from 'react'
import  './SideBar.css'
import { Link, useSearchParams } from 'react-router-dom'
import {useUser} from '../../../context/UserContext'
import StoreContext from '../../../context/StoreContext'


export default function SideBar() {
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
    
    <>
    {/* <div className="options-bar d-flex align-items-center justify-content-between">
          <div className='d-flex align-items-center'>
            <h5>Shop By:&nbsp;&nbsp;</h5>
            <ul className='d-flex list-group list-group-horizontal'>
              
            </ul>
          </div>
          <Cart show={showCart} handleShow={handleShow} shopContent={shopContent} />
        </div> */}
        <nav id="sidebarMenu" className="collapse d-lg-block sidebar collapse bg-white col-md-2 position-relative">
          <div className="side-position">
            <div className="list-group list-group-flush mx-3 mt-4">
            {
                categories?.map((category, i) => {
                  return (
                    <li key={i} onClick={(e) => {
                      e.target.classList.add("active")
                      setSearchParams({ category: category.toLowerCase() })
                      setActiveStatus(category.toLowerCase())
                      setContent([])
                      setSkip(0)
                    }} className={`list-group-item side-list ${activeStatus === category.toLowerCase() ? "active" : ""}`}>{category}</li>
                  )
                })
              }
              
            </div>
          </div>
        </nav>
    </>
  )
}
