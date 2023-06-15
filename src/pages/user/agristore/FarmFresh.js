import React, { useContext, useEffect, useState } from 'react'
import Modal from "react-bootstrap/Modal";
import { useUser } from '../../../context/UserContext';
import { toast } from 'react-toastify';
import ManagementContext from '../../../context/ManagementContext';
import Product from './Product';
import './FarmFresh.css'
import Button from 'react-bootstrap/esm/Button';
import farmFresh from '../../../assets/images/farmFresh.jpg'
import SideBar from './SideBar';
import CurrencyIconComponent from '../../../assets/widgets/CurrencyIconComponent';
import tag from '../../../assets/images/tag.png'
import rating from '../../../assets/images/rating.png'

export default function FarmFresh() {
  const productSelect = [{
    title: '<--Select-->',
    category: '',
    _id: 'select',
    quantity: '',
    estCost: ''
  }]
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false)
  const [receiverProduct, setReceiverProduct] = useState(productSelect)
  const { userData, currentUser, getUserData } = useUser()
  const { getUserInventory, inventory } = useContext(ManagementContext)

  useEffect(() => {
    if (currentUser && !userData) getUserData()
    if (userData) {
      getInventory()
    }
  }, [currentUser, userData])


  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  function handleDropdown() {
    setDropdown(!dropdown)
  }

  async function getInventory() {
    const data = await getUserInventory()
    console.log("inventory -- >",data)
    console.log(inventory)
    if (data.error)
      toast.error(data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
  }

  const SelectFromInventoryOptions=({ setProd, product, hide })=>{
    function changeSelectId() {
      setProd((e)=>{
        e.push(product)
        return e
      })
      hide()
    }
    return (
      <div onClick={changeSelectId} className='row align-items-center p-3 m-0 border rounded custom-Options'>
      <div className='col-12 d-flex justify-content-between  inventory-drop'>
        <div className='d-flex flex-column justify-content-center'>
          <div><h4>Category : {product.category}</h4></div>
          <div><h4>Item : {product.item}</h4></div>
        </div>
        <div className='d-flex flex-column justify-content-center'>
          <div><h5>Quantity : {product.quantity}</h5></div>
          {product.estCost && <div>{product.estCost} KCO</div>}
        </div>
      </div>
    </div>
    )
  }

  return (
    <>
      <div className='p-5 d-flex justify-content-around shadow  outer-prod'>
        <h2>Buy Exclusive Products Direct From The Farms</h2>
        <button onClick={showModal} className='btn btn-primary'>Add products from the inventory</button>
      </div>
      <Modal show={isOpen} onHide={hideModal}>
        <Modal.Header>
          <Modal.Title>Add Products from the Inventory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <fieldset className='w-100'>
              <div className='form-control position-relative bg-success bg-opacity-10 custom-Options' name='receiver'>
                <div onClick={handleDropdown}>
                  <div className='row p-0 m-0 rounded '>
                    <div className='col-8 d-flex flex-column justify-content-center'>
                      <div>{receiverProduct[0].title}</div>
                      {receiverProduct[0].estCost && <div>{receiverProduct[0].estCost} /-</div>}
                    </div>
                  </div>
                  {dropdown && (
                  <div className='position-absolute border border-success rounded w-100 options-Bg'>
                    {inventory.length > 0 ?
                      (
                        inventory.map(( product , i) => {
                          return <SelectFromInventoryOptions
                            key={'cartSelectKey' + i}
                            hide={handleDropdown}
                            setProd={setReceiverProduct}
                            product={product}
                          />
                        })
                      )
                      : <div className='text-center'>---your inventory is Empty---</div>
                    }
                  </div>
                )}
                  </div>
                </div>
            </fieldset>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={hideModal} className='btn btn-success'>Close</button>
        </Modal.Footer>
      </Modal>

      <div className='row'>
        <nav id="sidebarMenu" className="d-lg-block sidebar bg-white col-md-2 position-relative">
          <div className="side-position">
            <div className="list-group list-group-flush mx-3 mt-4">
              <li className="list-group-item side-list active">Category</li>
              <li className="list-group-item side-list ">Fruits</li>
              <li className="list-group-item side-list ">Vegetables</li>
              <li className="list-group-item side-list ">Herbs & Seasoning</li>
              <li className="list-group-item side-list ">Cuts & Sprouts</li>
              
              <li className="list-group-item side-list active">Prices</li>
              <li className="list-group-item side-list ">Less than 20 KCO</li>
              <li className="list-group-item side-list ">21 KCO to 50 KCO</li>
              <li className="list-group-item side-list ">51 KCO to 100 KCO</li>
              <li className="list-group-item side-list ">101 KCO to 200 KCO</li>
              <li className="list-group-item side-list ">201 KCO to 500 KCO</li>
              <li className="list-group-item side-list ">More than 501 KCO</li>
            </div>
          </div>
        </nav>

        <div className='d-flex col-md-10 justify-content-around flex-wrap'>
        {
          (inventory && inventory.length>0) ?
            (inventory.map((e,i)=>{
              return (
                <div className=' product-container col-12 col-sm-10 border shadow p-3'>
                <div className='d-flex flex-wrap col-12 col-sm-10 justify-content-between'>
                  <div className='col-12 col-sm-3'>
                    <img src={farmFresh} width='100%' alt='' />
                  </div>
                  <div className='d-flex col-10 col-sm-5 flex-column justify-content-center'>
                    <h5>{e.item}</h5>
                    <h5>({e.category})</h5>
                    <hr className='style-two' />
                    <span>Price:<CurrencyIconComponent size='30' adjustY={'-10%'} />KCO {e.estCost}/-</span>
                    <div className='text-danger'>Only {e.quantity} left</div>
                    <hr className='style-two' />
                  </div>
                    <div className='col-2 col-sm-2'>
                      <img src={tag} alt='' /><br/>
                      <img src={rating} alt='' />
                    </div>
                  
                </div>
                </div>
            )
          }))
          :
          <h1>No items added</h1>
        }
      </div>
      </div>
      
      
    </>
  )
}
