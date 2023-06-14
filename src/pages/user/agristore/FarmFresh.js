import React, { useContext, useEffect, useState } from 'react'
import Modal from "react-bootstrap/Modal";
import { useUser } from '../../../context/UserContext';
import { toast } from 'react-toastify';
import ManagementContext from '../../../context/ManagementContext';
import Product from './Product';
import './FarmFresh.css'
import Button from 'react-bootstrap/esm/Button';

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
                      {receiverProduct[0].estCost && <div>{receiverProduct[0].estCost} KCO</div>}
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

      <div className='d-flex p-5 justify-content-around flex-wrap'>
        {
          (receiverProduct.length>1) ?
            (receiverProduct.map((e,i)=>{
              if(i!==0){
              return (
                <div className=' product-container col-md-3 border shadow p-5'>
                    <h5>{e.item}</h5>
                    <h5>({e.category})</h5>
                    <hr className='style-two' />
                    <span>Price: {e.estCost} KCO</span>
                    <div>Quantity: {e.quantity}</div>
                    <hr className='style-two' />
                    <div className='overlay-box'>
                        <div className='inner d-flex justify-content-center align-items-center'>
                            <div className="d-flex justify-content-around flex-column">
                                <div>
                                    <Button variant="warning w-100" >Add To Cart</Button>
                                </div>
                                <div className='my-4'>
                                    <Button variant="success p-2 w-100">Buy Now</Button>
                                </div>
                                <Button variant="outline-success w-100" >View Details</Button>
                            </div>
                        </div>
                    </div>
                    </div>
              
            )}
          }))
          :
          <h1>No items added</h1>
        }
      </div>
      
    </>
  )
}
