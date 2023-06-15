import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../../../context/UserContext'
import Button from 'react-bootstrap/esm/Button'
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import ManagementContext from '../../../../context/ManagementContext';
import Table from 'react-bootstrap/esm/Table';
import './Inventory.css'

function Inventory() {

  const navigate = useNavigate()
  const { theme, userData, currentUser, getUserData } = useUser()
  const { INR, addItemToInventory, getUserInventory, deleteInventoryItem, updateQuantity, inventory, inventoryTotal } = useContext(ManagementContext)
  const [addItemModal, setAddItemModal] = useState(false)
  const [useItemModal, setUseItemModal] = useState(false)
  const [newItem, setNewItem] = useState({})
  const [deleteLoader, setDeleteLoader] = useState(false)
  const addItemForm = useRef()
  const useItemForm = useRef()
  const selectedItemConsumeQuantity = useRef()
  const [selectedItem, setSelectedItem] = useState({})


  function handleChange(e) {
    let data = { ...newItem }
    data[e.target.name] = e.target.value;
    setNewItem(data);
  }

  useEffect(() => {
    if (currentUser && !userData) getUserData()
    if (userData) {
      getInventory()
    }
  }, [currentUser, userData])

  async function addItem(e) {
    e.preventDefault()
    const data = await addItemToInventory(newItem)
    if (data.error)
      toast.error(data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    else {
      toast.success(data.message, {
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
    setAddItemModal(!addItemModal)
    setTimeout(() => {
      window.location.reload()
    }, 2000);
  }

  async function getInventory() {
    const data = await getUserInventory()
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

  async function deleteItem(itemId) {
    setDeleteLoader(true)
    const data = await deleteInventoryItem(itemId)
    if (data.error) {
      toast.error(data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setDeleteLoader(false)
    }
    else {
      toast.success(data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setDeleteLoader(false)
    }
    setTimeout(() => {
      window.location.reload()
    }, 2000);
  }

  async function consumeInventoryItem(e) {
    e.preventDefault()
    setUseItemModal(!useItemModal)
    const quantity = selectedItemConsumeQuantity.current.value
    const payload = {
      used: quantity,
      itemId: selectedItem._id
    }
    const data = await updateQuantity(payload)
    if (data.error) {
      toast.error(data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setDeleteLoader(false)
    }
    else {
      toast.success(data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setDeleteLoader(false)
    }
    setTimeout(() => {
      window.location.reload()
    }, 2000);
  }

  return (
    <>
      <div className={`planning-container theme-${theme}`}>
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
        <div className="planning-header">
          <Button className="link m-2" onClick={() => navigate("/management")} variant='warning'>&larr; Go back</Button>
          <div className="inventory-header d-flex justify-content-between align-items-center flex-wrap">
            <div className="m-2">
              <h3>INVENTORY</h3>
              <span className="subtext">Review and analyse your inventory to plan new requirements. Items brought from AgriStore will automatically be added to your inventory.</span>
            </div>
            <Button variant='success' style={{ height: "50px" }} onClick={() => { setAddItemModal(!addItemModal); setNewItem({}) }}>&#10010; Add item</Button>
            <Modal show={addItemModal} onHide={() => { setAddItemModal(!addItemModal); setNewItem({}) }}>
              <Modal.Header closeButton>
                <Modal.Title>Add item to inventory</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form ref={addItemForm} id="create-plan" onSubmit={addItem} className="create-plan-form">
                  <div className="requirement-form-group">
                    <input placeholder='Item name' onChange={(e) => { handleChange(e) }} type="text" name='item' className='form-input' />
                    <div className="d-flex flex-column">
                      <input placeholder='Quantity' min={1} onChange={(e) => { handleChange(e) }} type="number" name='quantity' className='form-input' />
                      <select className="form-select form-input" aria-label="Category" name='category' onChange={(e) => { handleChange(e) }} defaultValue={'Category'} required>
                        <option disabled>Category</option>
                        <option value="crop">Crop</option>
                        <option value="supplement">Supplement</option>
                      </select>
                    </div>
                    <div className='d-flex flex-column'>
                      <InputGroup className="m-1" style={{ width: "250px" }}>
                        <InputGroup.Text>₹</InputGroup.Text>
                        <Form.Control placeholder='Cost per unit' onChange={(e) => { handleChange(e) }} type="number" name='estCost' aria-label="Amount (to the nearest rupee)" />
                        <InputGroup.Text>.00</InputGroup.Text>
                      </InputGroup>
                    </div>
                  </div>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => { setAddItemModal(!addItemModal); setNewItem({}) }}>
                  Discard
                </Button>
                <Button type='submit' form="create-plan" variant="success" >
                  Add
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
        <hr className="style-two" />
        <div className="planning-content">
          <Table striped bordered>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Item</th>
                <th scope="col">Quantity</th>
                <th className="d-none d-sm-table-cell" scope="col">Price Per Unit</th>
                <th className="d-none d-sm-table-cell" scope="col">Total Cost</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                inventory?.length === 0 ? <tr>
                  <td className='d-none d-sm-table-cell' colSpan={6}>No items added yet.</td>
                  <td className='d-table-cell d-sm-none' colSpan={4}>No items added yet.</td>
                </tr>
                  :
                  inventory?.map((item, idx) => {
                    return (
                      <tr>
                        <th scope='row'>{idx + 1}</th>
                        <td>{item.item}</td>
                        <td>{item.quantity}</td>
                        <td className='d-none d-sm-table-cell'>{INR.format(item.estCost)}</td>
                        <td className='d-none d-sm-table-cell'>{INR.format(item.estCost * item.quantity)}</td>
                        <td className='d-flex justify-content-center'>
                          <Button className='m-1' variant='danger' disabled={deleteLoader} onClick={(e) => deleteItem(item._id)}>{deleteLoader ?
                            <>
                              <div className="spinner-border" role="status"></div>
                            </> : <>&#10008;</>}
                          </Button>
                          <Button className='m-1' variant='success' disabled={deleteLoader} onClick={(e) => { setUseItemModal(!useItemModal); setSelectedItem(item) }}>
                            Use
                          </Button>
                        </td>
                      </tr>
                    )
                  })
              }
              <tr>
                <th className='d-none d-sm-table-cell' colSpan={4}>Total Inventory Value</th>
                <th className='d-table-cell d-sm-none' colSpan={3}>Total Inventory Value</th>
                <td>{INR.format(inventoryTotal)}</td>
              </tr>
            </tbody>
          </Table>
          <Modal show={useItemModal} onHide={() => { setUseItemModal(!useItemModal); setSelectedItem({}) }}>
            <Modal.Header closeButton>
              <Modal.Title>Use item from inventory</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form ref={useItemForm} id="create-plan" onSubmit={consumeInventoryItem} className="create-plan-form">
                <input disabled={true} value={selectedItem.item} placeholder='Item name' onChange={(e) => { handleChange(e) }} type="text" name='item' className='form-input' />
                <input ref={selectedItemConsumeQuantity} placeholder='Quantity' min={1} onChange={(e) => { handleChange(e) }} type="number" name='quantity' className='form-input' />
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => { setUseItemModal(!useItemModal); setSelectedItem({}) }}>
                Cancel
              </Button>
              <Button type='submit' form="create-plan" variant="success" >
                Use
              </Button>
            </Modal.Footer>
          </Modal>

        </div>
      </div>
    </>

  )
}

export default Inventory